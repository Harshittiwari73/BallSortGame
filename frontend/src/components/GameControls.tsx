import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { undoMove, restartLevel, setHint } from '../redux/gameSlice';
import { findHint } from '../utils/hintSolver';

/**
 * Game controls: Undo, Restart, and Hint buttons
 * Touch-friendly with minimum 44px hit targets
 */
const GameControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tubes, history, isWon } = useAppSelector((state) => state.game);

  const handleUndo = () => {
    dispatch(undoMove());
  };

  const handleRestart = () => {
    dispatch(restartLevel());
  };

  const handleHint = () => {
    const hint = findHint(tubes);
    if (hint) {
      dispatch(setHint({ from: hint[0], to: hint[1] }));
    }
  };

  if (isWon) return null;

  return (
    <motion.div
      className="flex justify-center w-full gap-2 sm:gap-3 px-1 sm:px-4 mx-auto max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Undo */}
      <motion.button
        className="btn-secondary flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-3 sm:py-3 min-h-[48px] text-sm sm:text-sm font-bold"
        onClick={handleUndo}
        disabled={history.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: history.length === 0 ? 0.4 : 1 }}
      >
        <span className="text-sm sm:text-base">↩️</span>
        <span>Undo</span>
      </motion.button>

      {/* Restart */}
      <motion.button
        className="btn-secondary flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-3 sm:py-3 min-h-[48px] text-sm sm:text-sm font-bold"
        onClick={handleRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm sm:text-base">🔄</span>
        <span>Restart</span>
      </motion.button>

      {/* Hint */}
      <motion.button
        className="btn-secondary flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-3 sm:py-3 min-h-[48px] text-sm sm:text-sm font-bold"
        onClick={handleHint}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm sm:text-base">💡</span>
        <span>Hint</span>
        <span className="text-[9px] sm:text-[11px] opacity-50 ml-0.5">🪙5</span>
      </motion.button>
    </motion.div>
  );
};

export default GameControls;
