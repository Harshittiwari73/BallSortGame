using BallSortGame.Core.Interfaces;
using BallSortGame.Core.Models;
using BallSortGame.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BallSortGame.Infrastructure.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly AppDbContext _context;

        public ScoreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Score> CreateAsync(Score score)
        {
            _context.Scores.Add(score);
            await _context.SaveChangesAsync();
            return score;
        }

        public async Task<List<Score>> GetByUserIdAsync(int userId)
        {
            return await _context.Scores
                .Include(s => s.Level)
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CompletedAt)
                .ToListAsync();
        }

        public async Task<List<Score>> GetTopScoresAsync(int count)
        {
            return await _context.Scores
                .Include(s => s.User)
                .Include(s => s.Level)
                .OrderByDescending(s => s.CoinsEarned)
                .ThenBy(s => s.Moves)
                .ThenBy(s => s.TimeTaken)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Score?> GetBestScoreAsync(int userId, int levelId)
        {
            return await _context.Scores
                .Where(s => s.UserId == userId && s.LevelId == levelId)
                .OrderBy(s => s.Moves)
                .ThenBy(s => s.TimeTaken)
                .FirstOrDefaultAsync();
        }
    }
}
