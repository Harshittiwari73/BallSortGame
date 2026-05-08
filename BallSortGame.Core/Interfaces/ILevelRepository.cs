using BallSortGame.Core.Models;

namespace BallSortGame.Core.Interfaces
{
    public interface ILevelRepository
    {
        Task<List<Level>> GetAllAsync();
        Task<Level?> GetByIdAsync(int id);
        Task<List<Level>> GetByDifficultyAsync(int difficulty);
        Task<Level> CreateAsync(Level level);
    }
}
