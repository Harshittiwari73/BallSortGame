import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { undoMove, restartLevel, setHint } from '../redux/gameSlice';
import { findHint } from '../utils/hintSolver';

/**
 * Game controls: Undo, Restart, and Hint buttons
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
      className="flex justify-center gap-3 px-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Undo */}
      <motion.button
        className="btn-secondary flex items-center gap-2 px-5 py-3"
        onClick={handleUndo}
        disabled={history.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ opacity: history.length === 0 ? 0.4 : 1 }}
      >
        <span>↩️</span>
        <span className="text-sm font-medium">Undo</span>
      </motion.button>

      {/* Restart */}
      <motion.button
        className="btn-secondary flex items-center gap-2 px-5 py-3"
        onClick={handleRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🔄</span>
        <span className="text-sm font-medium">Restart</span>
      </motion.button>

      {/* Hint */}
      <motion.button
        className="btn-secondary flex items-center gap-2 px-5 py-3"
        onClick={handleHint}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>💡</span>
        <span className="text-sm font-medium">Hint</span>
        <span className="text-xs opacity-50 ml-1">🪙5</span>
      </motion.button>
    </motion.div>
  );
};

export default GameControls;
