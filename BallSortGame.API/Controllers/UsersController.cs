using BallSortGame.Application.DTOs;
using BallSortGame.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BallSortGame.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var profile = await _userService.GetProfileAsync(userId);
            if (profile == null) return NotFound(new { message = "User not found" });

            return Ok(profile);
        }

        /// <summary>
        /// Update user's game progress
        /// </summary>
        [HttpPut("progress")]
        public async Task<IActionResult> UpdateProgress([FromBody] UpdateProgressDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var result = await _userService.UpdateProgressAsync(userId, dto);
            if (result == null) return NotFound(new { message = "User not found" });

            return Ok(result);
        }
    }
}
