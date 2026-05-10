import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { nextLevel } from '../redux/gameSlice';
import { updateCoins, updateCurrentLevel } from '../redux/userSlice';

/**
 * Win celebration modal with confetti, stats, and next level button
 * Fully responsive for all mobile screen sizes
 */
const WinModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isWon, moves, timer, level, tubes } = useAppSelector((state) => state.game);
  const { user } = useAppSelector((state) => state.user);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Calculate stars based on moves and time
  const getStars = () => {
    let colorCount = 3; // Easy
    if (level > 50) colorCount = 5; // Medium
    if (level > 200) colorCount = 7; // Hard
    if (level > 400) colorCount = 10; // Expert
    if (level > 700) colorCount = 14; // Legend

    const targetMoves = colorCount * 6;
    const targetTime = colorCount * 20;

    let score = 5;

    if (moves > targetMoves * 2.5) score -= 4;
    else if (moves > targetMoves * 2.0) score -= 3;
    else if (moves > targetMoves * 1.5) score -= 2;
    else if (moves > targetMoves) score -= 1;

    if (timer > targetTime * 2 && score > 1) score -= 1;

    return Math.max(1, score);
  };

  // Calculate coins based on difficulty and performance
  useEffect(() => {
    if (isWon) {
      // Base difficulty multiplier
      let diffMultiplier = 1; // Easy
      if (level > 50) diffMultiplier = 2; // Medium
      if (level > 200) diffMultiplier = 4; // Hard
      if (level > 400) diffMultiplier = 8; // Expert
      if (level > 700) diffMultiplier = 15; // Legend

      let baseCoins = 10 * diffMultiplier;
      
      // Performance bonus
      let bonus = 0;
      if (stars === 5) bonus = 15 * diffMultiplier;
      else if (stars === 4) bonus = 10 * diffMultiplier;
      else if (stars === 3) bonus = 5 * diffMultiplier;

      let totalCoins = baseCoins + bonus;
      setCoinsEarned(totalCoins);

      dispatch(updateCoins(user.coins + totalCoins));

      if (level >= user.currentLevel) {
        dispatch(updateCurrentLevel(level + 1));
      }
    }
  }, [isWon]);

  const stars = getStars();

  const handleNextLevel = () => {
    dispatch(nextLevel());
  };

  const completedColors = isWon
    ? tubes
      .filter((t) => t.length === 4 && t.every((b) => b === t[0]))
      .map((t) => t[0])
    : [];

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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Effects Layer */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {confettiColors.map((color, i) =>
              Array.from({ length: 6 }).map((_, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600,
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

            {completedColors.map((color, i) =>
              Array.from({ length: 3 }).map((_, j) => (
                <motion.div
                  key={`bubble-${i}-${j}`}
                  className={`absolute ball ball-${color} shadow-2xl w-10 h-10 sm:w-14 sm:h-14 opacity-60`}
                  initial={{
                    x: (Math.random() - 0.5) * 300,
                    y: 600,
                    scale: 0,
                  }}
                  animate={{
                    y: -600,
                    x: (Math.random() - 0.5) * 400,
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

          {/* Modal card */}
          <motion.div
            className="glass-card text-center relative z-10 border-white/10 w-full max-w-[340px] sm:max-w-[380px] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Trophy */}
            <motion.div
              className="text-5xl sm:text-6xl mb-3 sm:mb-4"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              🏆
            </motion.div>

            <h2
              className="text-xl sm:text-2xl font-extrabold mb-1 sm:mb-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Level Complete!
            </h2>

            {/* Stars */}
            <div className="flex justify-center gap-1 sm:gap-2 my-3 sm:my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  className="text-2xl sm:text-3xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + star * 0.15, type: 'spring', stiffness: 300 }}
                >
                  {star <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-5 sm:gap-6 my-4 sm:my-6">
              <div>
                <p className="text-[10px] sm:text-xs opacity-60">Moves</p>
                <p className="text-lg sm:text-xl font-bold">{moves}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs opacity-60">Time</p>
                <p className="text-lg sm:text-xl font-bold font-mono">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs opacity-60">Coins</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">+{coinsEarned}</p>
              </div>
            </div>

            {/* Next Level button */}
            <motion.button
              className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4 mt-2"
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
