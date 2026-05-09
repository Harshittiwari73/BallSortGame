import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleDarkMode } from '../redux/uiSlice';
import { generateLevelConfig } from '../utils/puzzleGenerator';
import { loadLevel } from '../redux/gameSlice';

/**
 * Home screen with animated logo, play button, and navigation
 */
const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.user);

  const handlePlay = () => {
    const currentLevelNum = user?.currentLevel ?? 1;
    const config = generateLevelConfig(currentLevelNum);
    dispatch(loadLevel({ level: currentLevelNum, data: config.data }));
    navigate('/game');
  };

  return (
    <div className="game-bg min-h-screen flex flex-col items-center justify-center px-4">
      {/* Floating background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              background: `radial-gradient(circle, ${
                ['#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#ec4899'][i]
              }, transparent)`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo / Title */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {/* Animated balls as logo */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((color, i) => (
              <motion.div
                key={color}
                className={`ball ball-${color}`}
                style={{ width: 32, height: 32 }}
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <h1
            className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Ball Sort
          </h1>
          <p className="text-lg opacity-60 font-medium">Puzzle Game</p>
        </motion.div>

        {/* User greeting */}
        <motion.p
          className="mb-6 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
        >
          Welcome back, <span className="font-semibold text-purple-400">{user.username}</span>!
          <span className="ml-2 text-yellow-400">🪙 {user.coins}</span>
        </motion.p>

        {/* Main buttons */}
        <div className="flex flex-col gap-3 w-72 mx-auto">
          <motion.button
            className="btn-primary text-lg py-4 w-full"
            onClick={handlePlay}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            🎮 Play Game
          </motion.button>

          <motion.button
            className="btn-secondary text-base py-3 w-full"
            onClick={() => navigate('/levels')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            📋 Select Level
          </motion.button>

          <motion.button
            className="btn-secondary text-base py-3 w-full"
            onClick={() => navigate('/leaderboard')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            🏆 Leaderboard
          </motion.button>

          <motion.button
            className="btn-secondary text-base py-3 w-full"
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            👤 My Stats
          </motion.button>
        </div>

        {/* Theme toggle */}
        <motion.button
          className="btn-icon mt-8 mx-auto"
          onClick={() => dispatch(toggleDarkMode())}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
