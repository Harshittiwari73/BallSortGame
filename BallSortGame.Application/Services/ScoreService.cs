using BallSortGame.Application.DTOs;
using BallSortGame.Core.Interfaces;
using BallSortGame.Core.Models;

namespace BallSortGame.Application.Services
{
    /// <summary>
    /// Handles score saving, coin rewards, and leaderboard
    /// </summary>
    public class ScoreService
    {
        private readonly IScoreRepository _scoreRepository;
        private readonly IUserRepository _userRepository;

        public ScoreService(IScoreRepository scoreRepository, IUserRepository userRepository)
        {
            _scoreRepository = scoreRepository;
            _userRepository = userRepository;
        }

        /// <summary>
        /// Save a score and calculate coin rewards
        /// </summary>
        public async Task<ScoreResponseDto> SaveScoreAsync(int userId, SaveScoreDto dto)
        {
            // Calculate coins earned based on performance
            int coinsEarned = CalculateCoins(dto.Moves, dto.TimeTaken);

            var score = new Score
            {
                UserId = userId,
                LevelId = dto.LevelId,
                Moves = dto.Moves,
                TimeTaken = dto.TimeTaken,
                CoinsEarned = coinsEarned,
                CompletedAt = DateTime.UtcNow
            };

            var savedScore = await _scoreRepository.CreateAsync(score);

            // Update user's coins
            var user = await _userRepository.GetByIdAsync(userId);
            if (user != null)
            {
                user.Coins += coinsEarned;
                if (dto.LevelId >= user.CurrentLevel)
                {
                    user.CurrentLevel = dto.LevelId + 1;
                }
                await _userRepository.UpdateAsync(user);
            }

            return new ScoreResponseDto
            {
                Id = savedScore.Id,
                LevelId = savedScore.LevelId,
                Moves = savedScore.Moves,
                TimeTaken = savedScore.TimeTaken,
                CoinsEarned = savedScore.CoinsEarned,
                CompletedAt = savedScore.CompletedAt
            };
        }

        /// <summary>
        /// Get leaderboard with top players
        /// </summary>
        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(int count = 20)
        {
            var topPlayers = await _userRepository.GetTopPlayersAsync(count);
            var leaderboard = new List<LeaderboardEntryDto>();

            for (int i = 0; i < topPlayers.Count; i++)
            {
                var player = topPlayers[i];
                leaderboard.Add(new LeaderboardEntryDto
                {
                    Rank = i + 1,
                    Username = player.Username,
                    TotalScore = player.Scores?.Sum(s => s.CoinsEarned) ?? 0,
                    LevelsCompleted = player.Scores?.Count ?? 0,
                    TotalCoins = player.Coins
                });
            }

            return leaderboard;
        }

        /// <summary>
        /// Calculate coins earned based on moves and time
        /// </summary>
        private int CalculateCoins(int moves, int timeTaken)
        {
            int baseCoins = 10;

            // Bonus for fewer moves
            if (moves <= 10) baseCoins += 15;
            else if (moves <= 20) baseCoins += 10;
            else if (moves <= 30) baseCoins += 5;

            // Bonus for speed
            if (timeTaken <= 30) baseCoins += 15;
            else if (timeTaken <= 60) baseCoins += 10;
            else if (timeTaken <= 120) baseCoins += 5;

            return baseCoins;
        }
    }
}
