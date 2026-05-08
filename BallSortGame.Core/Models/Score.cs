using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BallSortGame.Core.Models
{
    /// <summary>
    /// Represents a player's score for a completed level
    /// </summary>
    public class Score
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int LevelId { get; set; }

        [Required]
        public int Moves { get; set; }

        /// <summary>
        /// Time taken in seconds
        /// </summary>
        [Required]
        public int TimeTaken { get; set; }

        public int CoinsEarned { get; set; } = 0;

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("LevelId")]
        public Level? Level { get; set; }
    }
}
