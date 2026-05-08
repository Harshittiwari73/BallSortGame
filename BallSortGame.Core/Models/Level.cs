using System.ComponentModel.DataAnnotations;

namespace BallSortGame.Core.Models
{
    /// <summary>
    /// Represents a game level configuration
    /// </summary>
    public class Level
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Difficulty: 1=Easy, 2=Medium, 3=Hard, 4=Expert
        /// </summary>
        [Required]
        public int Difficulty { get; set; }

        [Required]
        public int TubeCount { get; set; }

        [Required]
        public int ColorCount { get; set; }

        /// <summary>
        /// JSON-serialized puzzle configuration
        /// </summary>
        [Required]
        public string Data { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Score> Scores { get; set; } = new List<Score>();
    }
}
