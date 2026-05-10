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
    <div className="game-bg min-h-[100dvh] overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={() => navigate('/')} className="btn-icon w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
            ←
          </button>
          <h1
            className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold text-2xl sm:text-3xl flex-1 min-w-[150px]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Select Level
          </h1>
          <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap">
            Progress: <span className="text-purple-400">{currentLevel - 1}</span> / 500
          </div>
        </div>

        {/* Difficulty sections */}
        {[1, 2, 3, 4].map((diff) => {
          const diffLevels = levels.filter((l) => l.difficulty === diff);
          if (diffLevels.length === 0) return null;

          return (
            <div key={diff} className="mb-6 sm:mb-8 lg:mb-10">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div
                  className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: difficultyColors[diff] }}
                />
                <h2 className="text-sm sm:text-lg font-semibold opacity-80">
                  {difficultyLabels[diff]}
                </h2>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                {diffLevels.map((level, i) => {
                  const isLocked = level.id > currentLevel;
                  const isCompleted = level.id < currentLevel;

                  return (
                    <motion.button
                      key={level.id}
                      className={`glass-card text-center relative transition-all p-2 sm:p-3 ${
                        isLocked
                          ? 'opacity-40 cursor-not-allowed grayscale'
                          : 'cursor-pointer hover:border-purple-500'
                      }`}
                      onClick={() => handleSelectLevel(level)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      whileHover={!isLocked ? { scale: 1.08, y: -4 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                    >
                      {isLocked ? (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-lg sm:text-xl mb-0.5">🔒</span>
                          <span className="text-[9px] sm:text-[10px] opacity-50">
                            {level.id}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span
                            className="block font-bold text-sm sm:text-lg"
                            style={{ color: difficultyColors[diff] }}
                          >
                            {level.id}
                          </span>
                          <div className="text-[9px] sm:text-[10px] opacity-50 mt-0.5">
                            {level.colorCount}c · {level.tubeCount}t
                          </div>
                          {isCompleted && (
                            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-[8px] sm:text-[10px] text-green-400">
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
