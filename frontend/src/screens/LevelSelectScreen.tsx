import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadLevel } from '../redux/gameSlice';
import type { LevelConfig } from '../types';
import { generateLevelConfig } from '../utils/puzzleGenerator';

const difficultyColors: Record<number, string> = {
  1: '#22c55e',
  2: '#f59e0b',
  3: '#ef4444',
  4: '#a855f7',
};

const difficultyLabels: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Expert',
};

/**
 * Level selection screen with grid of levels — fully mobile responsive
 */
const LevelSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [levels, setLevels] = useState<LevelConfig[]>([]);

  const currentLevel = user?.currentLevel ?? 1;

  useEffect(() => {
    // Generate 500 levels locally
    const generated: LevelConfig[] = [];
    for (let i = 1; i <= 500; i++) {
      generated.push(generateLevelConfig(i));
    }
    setLevels(generated);
  }, []);

  const handleSelectLevel = (level: LevelConfig) => {
    if (level.id > currentLevel) return; // Prevent playing locked levels
    dispatch(loadLevel({ level: level.id, data: level.data }));
    navigate('/game');
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
            flexWrap: 'wrap',
          }}
        >
          <button onClick={() => navigate('/')} className="btn-icon">
            ←
          </button>
          <h1
            className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.4rem, 7vw, 2rem)',
              fontWeight: 700,
              flex: 1,
            }}
          >
            Select Level
          </h1>
          <div
            className="glass-card"
            style={{
              padding: 'clamp(4px, 1.5vw, 6px) clamp(10px, 3vw, 14px)',
              fontSize: 'clamp(11px, 2.8vw, 14px)',
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            Progress: <span style={{ color: '#a78bfa' }}>{currentLevel - 1}</span> / 500
          </div>
        </div>

        {/* Difficulty sections */}
        {[1, 2, 3, 4].map((diff) => {
          const diffLevels = levels.filter((l) => l.difficulty === diff);
          if (diffLevels.length === 0) return null;

          return (
            <div key={diff} style={{ marginBottom: 'clamp(20px, 5vw, 32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'clamp(8px, 2.5vw, 12px)' }}>
                <div
                  style={{
                    width: 'clamp(8px, 2.5vw, 12px)',
                    height: 'clamp(8px, 2.5vw, 12px)',
                    borderRadius: '50%',
                    backgroundColor: difficultyColors[diff],
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    fontSize: 'clamp(13px, 3.5vw, 18px)',
                    fontWeight: 600,
                    opacity: 0.8,
                  }}
                >
                  {difficultyLabels[diff]}
                </h2>
              </div>

              <div
                className="grid grid-cols-5"
                style={{ gap: 'clamp(6px, 2vw, 12px)' }}
              >
                {diffLevels.map((level, i) => {
                  const isLocked = level.id > currentLevel;
                  const isCompleted = level.id < currentLevel;

                  return (
                    <motion.button
                      key={level.id}
                      className={`glass-card text-center relative transition-all ${
                        isLocked
                          ? 'opacity-40 cursor-not-allowed grayscale'
                          : 'cursor-pointer hover:border-purple-500'
                      }`}
                      style={{
                        padding: 'clamp(8px, 2.5vw, 16px) clamp(4px, 1.5vw, 8px)',
                      }}
                      onClick={() => handleSelectLevel(level)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      whileHover={!isLocked ? { scale: 1.08, y: -4 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                    >
                      {isLocked ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 'clamp(14px, 3.5vw, 20px)', marginBottom: '2px' }}>🔒</span>
                          <span style={{ fontSize: 'clamp(8px, 2vw, 11px)', opacity: 0.5 }}>
                            {level.id}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: 'clamp(13px, 3.5vw, 20px)',
                              fontWeight: 700,
                              color: difficultyColors[diff],
                              display: 'block',
                            }}
                          >
                            {level.id}
                          </span>
                          <div style={{ fontSize: 'clamp(8px, 2vw, 11px)', opacity: 0.5, marginTop: '2px' }}>
                            {level.colorCount}c · {level.tubeCount}t
                          </div>
                          {isCompleted && (
                            <div style={{ position: 'absolute', top: '3px', right: '4px', fontSize: '9px', color: '#4ade80' }}>
                              ✓
                            </div>
                          )}
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelectScreen;
