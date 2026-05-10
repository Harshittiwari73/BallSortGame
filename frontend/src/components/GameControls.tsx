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
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(8px, 2.5vw, 12px)',
        padding: 'clamp(8px, 2.5vw, 16px) clamp(12px, 3vw, 16px)',
        width: '100%',
        maxWidth: '480px',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Undo */}
      <motion.button
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1.5vw, 8px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 20px)',
          flex: 1,
          justifyContent: 'center',
          minHeight: '44px',
          fontSize: 'clamp(12px, 3vw, 14px)',
        }}
        onClick={handleUndo}
        disabled={history.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: history.length === 0 ? 0.4 : 1 }}
      >
        <span>↩️</span>
        <span style={{ fontWeight: 500 }}>Undo</span>
      </motion.button>

      {/* Restart */}
      <motion.button
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1.5vw, 8px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 20px)',
          flex: 1,
          justifyContent: 'center',
          minHeight: '44px',
          fontSize: 'clamp(12px, 3vw, 14px)',
        }}
        onClick={handleRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🔄</span>
        <span style={{ fontWeight: 500 }}>Restart</span>
      </motion.button>

      {/* Hint */}
      <motion.button
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1.5vw, 8px)',
          padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 20px)',
          flex: 1,
          justifyContent: 'center',
          minHeight: '44px',
          fontSize: 'clamp(12px, 3vw, 14px)',
        }}
        onClick={handleHint}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>💡</span>
        <span style={{ fontWeight: 500 }}>Hint</span>
        <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', opacity: 0.5, marginLeft: '2px' }}>🪙5</span>
      </motion.button>
    </motion.div>
  );
};

export default GameControls;
