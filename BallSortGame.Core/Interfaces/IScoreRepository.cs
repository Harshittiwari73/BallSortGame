using BallSortGame.Core.Models;

namespace BallSortGame.Core.Interfaces
{
    public interface IScoreRepository
    {
        Task<Score> CreateAsync(Score score);
        Task<List<Score>> GetByUserIdAsync(int userId);
        Task<List<Score>> GetTopScoresAsync(int count);
        Task<Score?> GetBestScoreAsync(int userId, int levelId);
    }
}
