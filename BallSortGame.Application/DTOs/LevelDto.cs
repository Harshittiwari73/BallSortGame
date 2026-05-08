namespace BallSortGame.Application.DTOs
{
    public class LevelDto
    {
        public int Id { get; set; }
        public int Difficulty { get; set; }
        public string DifficultyName { get; set; } = string.Empty;
        public int TubeCount { get; set; }
        public int ColorCount { get; set; }
        public string Data { get; set; } = string.Empty;
    }
}
