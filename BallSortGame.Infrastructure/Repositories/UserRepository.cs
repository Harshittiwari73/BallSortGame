using BallSortGame.Core.Interfaces;
using BallSortGame.Core.Models;
using BallSortGame.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BallSortGame.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Scores)
                .Include(u => u.UserAchievements)
                    .ThenInclude(ua => ua.Achievement)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<List<User>> GetTopPlayersAsync(int count)
        {
            return await _context.Users
                .Include(u => u.Scores)
                .OrderByDescending(u => u.Scores.Count)
                .ThenByDescending(u => u.Coins)
                .Take(count)
                .ToListAsync();
        }
    }
}
