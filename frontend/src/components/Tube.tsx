import React from 'react';
import { motion } from 'framer-motion';
import Ball from './Ball';

interface TubeProps {
  balls: number[];
  index: number;
  isSelected: boolean;
  isHintFrom: boolean;
  isHintTo: boolean;
  onClick: () => void;
}

/**
 * Renders a vertical test tube with stacked balls
 */
const Tube: React.FC<TubeProps> = ({ balls, index, isSelected, isHintFrom, isHintTo, onClick }) => {
  const isComplete = balls.length === 4 && balls.every(b => b === balls[0]);

  let borderClass = '';
  if (isSelected) borderClass = 'selected';
  if (isHintFrom) borderClass = 'hint-from';
  if (isHintTo) borderClass = 'hint-to';

  return (
    <motion.div
      className={`tube-container ${borderClass}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Top ball floating indicator when selected */}
      {isSelected && balls.length > 0 && (
        <motion.div
          className="absolute -top-14"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className={`ball ball-${balls[balls.length - 1]} ball-floating`}
               style={{ width: 36, height: 36 }} />
        </motion.div>
      )}

      {/* Tube body */}
      <div
        className="tube"
        style={{
          borderColor: isSelected
            ? '#8b5cf6'
            : isHintFrom
            ? '#f59e0b'
            : isHintTo
            ? '#22c55e'
            : isComplete
            ? '#22c55e40'
            : undefined,
          boxShadow: isSelected
            ? '0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.1)'
            : isHintFrom
            ? '0 0 25px rgba(245, 158, 11, 0.4)'
            : isHintTo
            ? '0 0 25px rgba(34, 197, 94, 0.4)'
            : isComplete
            ? '0 0 15px rgba(34, 197, 94, 0.2)'
            : undefined,
        }}
      >
        {balls.map((color, ballIndex) => (
          <Ball
            key={`${index}-${ballIndex}`}
            color={color}
            index={ballIndex}
            isFloating={isSelected && ballIndex === balls.length - 1}
          />
        ))}
      </div>

      {/* Tube number label */}
      <span className="text-xs mt-1 opacity-40 font-medium">{index + 1}</span>

      {/* Complete checkmark */}
      {isComplete && (
        <motion.div
          className="absolute -top-3 right-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <span className="text-green-400 text-lg">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tube;
