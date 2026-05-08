using BallSortGame.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BallSortGame.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LevelsController : ControllerBase
    {
        private readonly LevelService _levelService;

        public LevelsController(LevelService levelService)
        {
            _levelService = levelService;
        }

        /// <summary>
        /// Get all available levels
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var levels = await _levelService.GetAllLevelsAsync();
            return Ok(levels);
        }

        /// <summary>
        /// Get a specific level by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var level = await _levelService.GetLevelByIdAsync(id);
            if (level == null) return NotFound(new { message = "Level not found" });
            return Ok(level);
        }

        /// <summary>
        /// Get levels by difficulty (1=Easy, 2=Medium, 3=Hard, 4=Expert)
        /// </summary>
        [HttpGet("difficulty/{difficulty}")]
        public async Task<IActionResult> GetByDifficulty(int difficulty)
        {
            var levels = await _levelService.GetLevelsByDifficultyAsync(difficulty);
            return Ok(levels);
        }
    }
}
