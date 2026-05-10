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
    <div
      className="game-bg overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3.5vw, 16px)',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 3vw, 16px)',
            marginBottom: 'clamp(16px, 4.5vw, 28px)',
          }}
        >
          <button onClick={() => navigate('/')} className="btn-icon">
            ←
          </button>
          <h1
            className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.4rem, 7vw, 2rem)',
              fontWeight: 700,
            }}
          >
            🏆 Leaderboard
          </h1>
        </div>

        {error && (
          <div
            className="glass-card border-yellow-500/30"
            style={{
              padding: 'clamp(8px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
              marginBottom: 'clamp(10px, 3vw, 16px)',
              fontSize: 'clamp(11px, 2.8vw, 13px)',
              color: '#facc15',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <motion.div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid #a855f7',
                borderTopColor: 'transparent',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2.5vw, 12px)' }}>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.rank}
                className={`glass-card ${entry.rank <= 3 ? 'border-yellow-500/30' : ''}`}
                style={{
                  padding: 'clamp(10px, 3vw, 16px) clamp(12px, 3.5vw, 16px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(10px, 3vw, 16px)',
                }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Rank */}
                <div
                  style={{
                    fontSize: 'clamp(16px, 5vw, 24px)',
                    fontWeight: 700,
                    width: 'clamp(32px, 8vw, 48px)',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getRankEmoji(entry.rank)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 3.5vw, 18px)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.username}
                  </p>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', opacity: 0.5 }}>
                    {entry.levelsCompleted} levels completed
                  </p>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: 700, color: '#a78bfa' }}>
                    {entry.totalScore}
                  </p>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', color: '#facc15' }}>
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
