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
 * Level selection screen with grid of levels
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
    <div className="game-bg min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="btn-icon">
            ←
          </button>
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Select Level
          </h1>
          <div className="ml-auto glass-card px-3 py-1 text-sm font-medium">
            Progress: <span className="text-purple-400">{currentLevel - 1}</span> / 500
          </div>
        </div>

        {/* Difficulty sections */}
        {[1, 2, 3, 4].map((diff) => {
          const diffLevels = levels.filter((l) => l.difficulty === diff);
          if (diffLevels.length === 0) return null;

          return (
            <div key={diff} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: difficultyColors[diff] }}
                />
                <h2 className="text-lg font-semibold opacity-80">{difficultyLabels[diff]}</h2>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {diffLevels.map((level, i) => {
                  const isLocked = level.id > currentLevel;
                  const isCompleted = level.id < currentLevel;

                  return (
                    <motion.button
                      key={level.id}
                      className={`glass-card p-4 text-center relative transition-all ${
                        isLocked 
                          ? 'opacity-40 cursor-not-allowed grayscale' 
                          : 'cursor-pointer hover:border-purple-500'
                      }`}
                      onClick={() => handleSelectLevel(level)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }} // Cap delay for large lists
                      whileHover={!isLocked ? { scale: 1.08, y: -4 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                    >
                      {isLocked ? (
                        <div className="flex flex-col items-center justify-center py-1">
                          <span className="text-xl mb-1">🔒</span>
                          <span className="text-xs opacity-50">Level {level.id}</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-xl font-bold" style={{ color: difficultyColors[diff] }}>
                            {level.id}
                          </span>
                          <div className="text-xs opacity-50 mt-1">
                            {level.colorCount}c · {level.tubeCount}t
                          </div>
                          {isCompleted && (
                            <div className="absolute top-1 right-1 text-[10px] text-green-400">
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
