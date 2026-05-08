using System.ComponentModel.DataAnnotations;

namespace BallSortGame.Core.Models
{
    /// <summary>
    /// Represents a game achievement that players can unlock
    /// </summary>
    public class Achievement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(256)]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// JSON criteria for unlocking (e.g., {"type":"levels_completed","value":10})
        /// </summary>
        [MaxLength(256)]
        public string Criteria { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    }
}
