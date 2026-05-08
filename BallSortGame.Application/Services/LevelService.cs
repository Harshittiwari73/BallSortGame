using BallSortGame.Application.DTOs;
using BallSortGame.Core.Interfaces;

namespace BallSortGame.Application.Services
{
    /// <summary>
    /// Handles level retrieval and difficulty mapping
    /// </summary>
    public class LevelService
    {
        private readonly ILevelRepository _levelRepository;
        private static readonly Dictionary<int, string> DifficultyNames = new()
        {
            { 1, "Easy" },
            { 2, "Medium" },
            { 3, "Hard" },
            { 4, "Expert" }
        };

        public LevelService(ILevelRepository levelRepository)
        {
            _levelRepository = levelRepository;
        }

        /// <summary>
        /// Get all levels with difficulty names
        /// </summary>
        public async Task<List<LevelDto>> GetAllLevelsAsync()
        {
            var levels = await _levelRepository.GetAllAsync();
            return levels.Select(l => new LevelDto
            {
                Id = l.Id,
                Difficulty = l.Difficulty,
                DifficultyName = DifficultyNames.GetValueOrDefault(l.Difficulty, "Unknown"),
                TubeCount = l.TubeCount,
                ColorCount = l.ColorCount,
                Data = l.Data
            }).ToList();
        }

        /// <summary>
        /// Get a specific level by ID
        /// </summary>
        public async Task<LevelDto?> GetLevelByIdAsync(int id)
        {
            var level = await _levelRepository.GetByIdAsync(id);
            if (level == null) return null;

            return new LevelDto
            {
                Id = level.Id,
                Difficulty = level.Difficulty,
                DifficultyName = DifficultyNames.GetValueOrDefault(level.Difficulty, "Unknown"),
                TubeCount = level.TubeCount,
                ColorCount = level.ColorCount,
                Data = level.Data
            };
        }

        /// <summary>
        /// Get levels filtered by difficulty
        /// </summary>
        public async Task<List<LevelDto>> GetLevelsByDifficultyAsync(int difficulty)
        {
            var levels = await _levelRepository.GetByDifficultyAsync(difficulty);
            return levels.Select(l => new LevelDto
            {
                Id = l.Id,
                Difficulty = l.Difficulty,
                DifficultyName = DifficultyNames.GetValueOrDefault(l.Difficulty, "Unknown"),
                TubeCount = l.TubeCount,
                ColorCount = l.ColorCount,
                Data = l.Data
            }).ToList();
        }
    }
}
