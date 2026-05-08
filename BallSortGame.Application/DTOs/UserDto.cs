namespace BallSortGame.Application.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Coins { get; set; }
        public int CurrentLevel { get; set; }
        public int LevelsCompleted { get; set; }
        public List<AchievementDto> Achievements { get; set; } = new();
    }

    public class AchievementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? UnlockedAt { get; set; }
    }

    public class UpdateProgressDto
    {
        public int CurrentLevel { get; set; }
        public int Coins { get; set; }
    }
}
