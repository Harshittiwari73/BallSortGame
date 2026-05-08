using BallSortGame.Application.DTOs;
using BallSortGame.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BallSortGame.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoresController : ControllerBase
    {
        private readonly ScoreService _scoreService;

        public ScoresController(ScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        /// <summary>
        /// Save a score for a completed level (requires authentication)
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SaveScore([FromBody] SaveScoreDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var result = await _scoreService.SaveScoreAsync(userId, dto);
            return Ok(result);
        }

        /// <summary>
        /// Get the top players leaderboard
        /// </summary>
        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int count = 20)
        {
            var leaderboard = await _scoreService.GetLeaderboardAsync(count);
            return Ok(leaderboard);
        }
    }
}
