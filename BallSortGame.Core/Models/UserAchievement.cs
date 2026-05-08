using System.ComponentModel.DataAnnotations.Schema;

namespace BallSortGame.Core.Models
{
    /// <summary>
    /// Many-to-many join table between Users and Achievements
    /// </summary>
    public class UserAchievement
    {
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("AchievementId")]
        public Achievement? Achievement { get; set; }
    }
}
