using BallSortGame.Application.DTOs;
using BallSortGame.Core.Interfaces;

namespace BallSortGame.Application.Services
{
    /// <summary>
    /// Handles user profile and progress management
    /// </summary>
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// Get user profile with achievements
        /// </summary>
        public async Task<UserDto?> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Coins = user.Coins,
                CurrentLevel = user.CurrentLevel,
                LevelsCompleted = user.Scores?.Count ?? 0,
                Achievements = user.UserAchievements?.Select(ua => new AchievementDto
                {
                    Id = ua.AchievementId,
                    Name = ua.Achievement?.Name ?? "",
                    Description = ua.Achievement?.Description ?? "",
                    UnlockedAt = ua.UnlockedAt
                }).ToList() ?? new List<AchievementDto>()
            };
        }

        /// <summary>
        /// Update user's game progress (level and coins)
        /// </summary>
        public async Task<UserDto?> UpdateProgressAsync(int userId, UpdateProgressDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            user.CurrentLevel = dto.CurrentLevel;
            user.Coins = dto.Coins;
            await _userRepository.UpdateAsync(user);

            return await GetProfileAsync(userId);
        }
    }
}
