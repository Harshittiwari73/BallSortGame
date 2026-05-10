import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../redux/hooks';

/**
 * A beautiful glassmorphism overlay that appears when the game is automatically
 * paused due to the user switching tabs or the app going to the background.
 */
const PauseOverlay: React.FC = () => {
  const { isPaused, isWon } = useAppSelector((state) => state.game);

  // If the game is already won, don't show the pause overlay even if they switch tabs
  if (isWon) return null;

  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div
          className="absolute inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="glass-card flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-sm w-full border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
              className="text-4xl sm:text-5xl mb-4 opacity-80"
            >
              ⏳
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white tracking-tight">Game Paused</h2>
            <p className="text-sm sm:text-base text-white/60 font-medium">
              We stopped the timer for you. Click anywhere or return to the game to resume.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PauseOverlay;
