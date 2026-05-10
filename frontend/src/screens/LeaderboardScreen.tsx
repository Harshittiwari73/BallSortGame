import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { LeaderboardEntry } from '../types';
import { scoreService } from '../services/scoreService';

/**
 * Leaderboard screen showing top players — mobile responsive
 */
const LeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scoreService
      .getLeaderboard(20)
      .then(setEntries)
      .catch(() => {
        setError('Could not load leaderboard. Server may be offline.');
        // Show mock data for offline mode
        setEntries([
          { rank: 1, username: 'ProSorter', totalScore: 450, levelsCompleted: 25, totalCoins: 890 },
          { rank: 2, username: 'BallMaster', totalScore: 380, levelsCompleted: 20, totalCoins: 720 },
          { rank: 3, username: 'PuzzleKing', totalScore: 310, levelsCompleted: 18, totalCoins: 650 },
          { rank: 4, username: 'SortWizard', totalScore: 260, levelsCompleted: 15, totalCoins: 520 },
          { rank: 5, username: 'ColorPro', totalScore: 200, levelsCompleted: 12, totalCoins: 400 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="game-bg min-h-[100dvh] overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={() => navigate('/')} className="btn-icon w-10 h-10 sm:w-11 sm:h-11">
            ←
          </button>
          <h1 className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold text-2xl sm:text-3xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            🏆 Leaderboard
          </h1>
        </div>

        {error && (
          <div className="glass-card border-yellow-500/30 p-3 sm:p-4 mb-4 sm:mb-5 text-xs sm:text-sm text-yellow-400">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16 sm:py-20">
            <motion.div
              className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.rank}
                className={`glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4 ${entry.rank <= 3 ? 'border-yellow-500/30' : ''}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Rank */}
                <div className="text-xl sm:text-2xl font-bold w-10 sm:w-12 text-center flex-shrink-0">
                  {getRankEmoji(entry.rank)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                    {entry.username}
                  </p>
                  <p className="text-[10px] sm:text-xs opacity-50">
                    {entry.levelsCompleted} levels completed
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-lg font-bold text-purple-400">
                    {entry.totalScore}
                  </p>
                  <p className="text-[10px] sm:text-xs text-yellow-400">
                    🪙 {entry.totalCoins}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
