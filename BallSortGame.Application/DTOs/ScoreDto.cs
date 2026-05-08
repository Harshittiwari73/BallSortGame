using System.ComponentModel.DataAnnotations;

namespace BallSortGame.Application.DTOs
{
    public class SaveScoreDto
    {
        [Required]
        public int LevelId { get; set; }

        [Required]
        public int Moves { get; set; }

        [Required]
        public int TimeTaken { get; set; }
    }

    public class ScoreResponseDto
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public int Moves { get; set; }
        public int TimeTaken { get; set; }
        public int CoinsEarned { get; set; }
        public DateTime CompletedAt { get; set; }
    }

    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public string Username { get; set; } = string.Empty;
        public int TotalScore { get; set; }
        public int LevelsCompleted { get; set; }
        public int TotalCoins { get; set; }
    }
}
