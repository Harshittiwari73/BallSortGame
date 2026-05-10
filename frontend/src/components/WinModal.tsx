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
    let colorCount = 2;
    if (level > 50) colorCount = 3;
    if (level > 150) colorCount = 5;
    if (level > 350) colorCount = 8;

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

      dispatch(updateCoins(user.coins + coinsEarned));

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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 4vw, 16px)',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Effects Layer */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {confettiColors.map((color, i) =>
              Array.from({ length: 6 }).map((_, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  style={{
                    position: 'absolute',
                    width: 'clamp(8px, 2.5vw, 12px)',
                    height: 'clamp(8px, 2.5vw, 12px)',
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
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
                  className={`absolute ball ball-${color} shadow-2xl`}
                  style={{
                    width: 'clamp(40px, 10vw, 60px)',
                    height: 'clamp(40px, 10vw, 60px)',
                    opacity: 0.6,
                  }}
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
            className="glass-card text-center relative z-10 border-white/10 w-full"
            style={{
              maxWidth: 'min(380px, calc(100vw - 24px))',
              padding: 'clamp(20px, 5vw, 32px)',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              borderRadius: 'clamp(16px, 4vw, 24px)',
            }}
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Trophy */}
            <motion.div
              style={{ fontSize: 'clamp(3rem, 12vw, 4rem)', marginBottom: 'clamp(8px, 2.5vw, 16px)' }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              🏆
            </motion.div>

            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(1.2rem, 5.5vw, 1.6rem)',
                fontWeight: 800,
                marginBottom: 'clamp(4px, 1.5vw, 8px)',
              }}
            >
              Level Complete!
            </h2>

            {/* Stars */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(4px, 1.5vw, 8px)',
                margin: 'clamp(10px, 3vw, 16px) 0',
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  style={{ fontSize: 'clamp(1.5rem, 7vw, 2.25rem)' }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + star * 0.15, type: 'spring', stiffness: 300 }}
                >
                  {star <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(16px, 5vw, 24px)',
                margin: 'clamp(12px, 3.5vw, 24px) 0',
              }}
            >
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.8vw, 14px)', opacity: 0.6 }}>Moves</p>
                <p style={{ fontSize: 'clamp(1.2rem, 5.5vw, 1.5rem)', fontWeight: 700 }}>{moves}</p>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.8vw, 14px)', opacity: 0.6 }}>Time</p>
                <p style={{ fontSize: 'clamp(1.2rem, 5.5vw, 1.5rem)', fontWeight: 700, fontFamily: 'monospace' }}>
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(10px, 2.8vw, 14px)', opacity: 0.6 }}>Coins</p>
                <p style={{ fontSize: 'clamp(1.2rem, 5.5vw, 1.5rem)', fontWeight: 700, color: '#facc15' }}>+{coinsEarned}</p>
              </div>
            </div>

            {/* Next Level button */}
            <motion.button
              className="btn-primary w-full"
              style={{
                fontSize: 'clamp(14px, 4vw, 18px)',
                padding: 'clamp(12px, 3.5vw, 16px)',
                marginTop: 'clamp(6px, 2vw, 8px)',
              }}
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
