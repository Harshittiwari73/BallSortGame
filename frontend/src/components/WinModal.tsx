import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { nextLevel } from '../redux/gameSlice';
import { updateCoins, updateCurrentLevel } from '../redux/userSlice';
/**
 * Win celebration modal with confetti, stats, and next level button
 */
const WinModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isWon, moves, timer, level, tubes } = useAppSelector((state) => state.game);
  const { user } = useAppSelector((state) => state.user);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Calculate stars based on moves
  const getStars = () => {
    if (moves <= 10) return 3;
    if (moves <= 20) return 2;
    return 1;
  };

  // Calculate coins
  useEffect(() => {
    if (isWon) {
      let coins = 10;
      if (moves <= 10) coins += 15;
      else if (moves <= 20) coins += 10;
      else coins += 5;
      if (timer <= 30) coins += 15;
      else if (timer <= 60) coins += 10;
      else coins += 5;
      setCoinsEarned(coins);

      // Update local progress
      dispatch(updateCoins(user.coins + coinsEarned));
      
      // Only unlock next level if this was the current highest level
      if (level >= user.currentLevel) {
        dispatch(updateCurrentLevel(level + 1));
      }
    }
  }, [isWon]);

  const stars = getStars();

  const handleNextLevel = () => {
    dispatch(nextLevel());
  };

  // Extract colors from completed tubes
  const completedColors = isWon
    ? tubes
      .filter((t) => t.length === 4 && t.every((b) => b === t[0]))
      .map((t) => t[0])
    : [];

  // Confetti particles
  const confettiColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#ec4899', '#06b6d4'];

  return (
    <AnimatePresence>
      {isWon && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Effects Layer (Confetti & Bubbles) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Confetti particles */}
            {confettiColors.map((color, i) =>
              Array.from({ length: 6 }).map((_, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 800,
                    scale: [0, 1, 0.5],
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 720,
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.05 + j * 0.02,
                    ease: 'easeOut',
                  }}
                />
              ))
            )}

            {/* Sorted Bubbles Animation */}
            {completedColors.map((color, i) =>
              Array.from({ length: 3 }).map((_, j) => (
                <motion.div
                  key={`bubble-${i}-${j}`}
                  className={`absolute ball ball-${color} shadow-2xl`}
                  style={{
                    width: 60 + j * 20,
                    height: 60 + j * 20,
                    opacity: 0.6,
                  }}
                  initial={{
                    x: (Math.random() - 0.5) * 400,
                    y: 600,
                    scale: 0,
                  }}
                  animate={{
                    y: -600,
                    x: (Math.random() - 0.5) * 600,
                    scale: [0, 1.5, 1],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    delay: i * 0.2 + j * 0.15,
                    ease: 'easeOut',
                  }}
                />
              ))
            )}
          </div>

          {/* Modal card - Centered exactly using transform */}
          <motion.div
            className="glass-card relative z-10 p-8 text-center max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10"
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Trophy */}
            <motion.div
              className="text-6xl mb-4"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              🏆
            </motion.div>

            <h2
              className="text-2xl font-extrabold mb-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Level Complete!
            </h2>

            {/* Stars */}
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3].map((star) => (
                <motion.span
                  key={star}
                  className="text-4xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + star * 0.2, type: 'spring', stiffness: 300 }}
                >
                  {star <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 my-6">
              <div>
                <p className="text-sm opacity-60">Moves</p>
                <p className="text-2xl font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-sm opacity-60">Time</p>
                <p className="text-2xl font-bold font-mono">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-60">Coins</p>
                <p className="text-2xl font-bold text-yellow-400">+{coinsEarned}</p>
              </div>
            </div>

            {/* Next Level button */}
            <motion.button
              className="btn-primary w-full text-lg py-4 mt-2"
              onClick={handleNextLevel}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinModal;
