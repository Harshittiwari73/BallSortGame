using BallSortGame.Core.Interfaces;
using BallSortGame.Core.Models;
using BallSortGame.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BallSortGame.Infrastructure.Repositories
{
    public class LevelRepository : ILevelRepository
    {
        private readonly AppDbContext _context;

        public LevelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Level>> GetAllAsync()
        {
            return await _context.Levels.OrderBy(l => l.Difficulty).ThenBy(l => l.Id).ToListAsync();
        }

        public async Task<Level?> GetByIdAsync(int id)
        {
            return await _context.Levels.FindAsync(id);
        }

        public async Task<List<Level>> GetByDifficultyAsync(int difficulty)
        {
            return await _context.Levels.Where(l => l.Difficulty == difficulty).ToListAsync();
        }

        public async Task<Level> CreateAsync(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();
            return level;
        }
    }
}
