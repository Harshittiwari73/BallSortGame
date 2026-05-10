import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ball from './Ball';

interface TubeProps {
  balls: number[];
  index: number;
  isSelected: boolean;
  isValidTarget?: boolean;
  isHintFrom: boolean;
  isHintTo: boolean;
  isPerfect: boolean;
  onClick: () => void;
}

/**
 * Renders a vertical test tube with stacked balls
 */
const Tube: React.FC<TubeProps> = ({ balls, index, isSelected, isValidTarget, isHintFrom, isHintTo, isPerfect, onClick }) => {
  const isComplete = balls.length === 4 && balls.every(b => b === balls[0]);

  let borderClass = '';
  if (isSelected) borderClass = 'selected';
  if (isValidTarget) borderClass = 'valid-target';
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
      {/* Multi-ball floating indicator when selected */}
      {isSelected && balls.length > 0 && (
        <div className="absolute -top-12 flex flex-col-reverse items-center">
          {(() => {
            const topColor = balls[balls.length - 1];
            let count = 0;
            for (let i = balls.length - 1; i >= 0; i--) {
              if (balls[i] === topColor) count++;
              else break;
            }
            return Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={`floating-${i}`}
                className={`ball ball-${topColor} ball-floating`}
                style={{ 
                  marginBottom: -8 // Stagger them slightly
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -i * 5, opacity: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 25,
                  delay: i * 0.05 
                }}
              />
            ));
          })()}
        </div>
      )}

      {/* Tube body */}
      <div
        className="tube"
        style={{
          borderColor: isSelected
            ? '#8b5cf6'
            : isValidTarget
            ? '#22c55e80'
            : isHintFrom
            ? '#f59e0b'
            : isHintTo
            ? '#22c55e'
            : isComplete
            ? '#22c55e40'
            : undefined,
          boxShadow: isSelected
            ? '0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.1)'
            : isValidTarget
            ? '0 0 20px rgba(34, 197, 94, 0.2)'
            : isHintFrom
            ? '0 0 25px rgba(245, 158, 11, 0.4)'
            : isHintTo
            ? '0 0 25px rgba(34, 197, 94, 0.4)'
            : isComplete
            ? '0 0 15px rgba(34, 197, 94, 0.2)'
            : undefined,
        }}
      >
        {(() => {
          const topColor = balls[balls.length - 1];
          let floatCount = 0;
          if (isSelected) {
            for (let i = balls.length - 1; i >= 0; i--) {
              if (balls[i] === topColor) floatCount++;
              else break;
            }
          }
          
          return balls.map((color, ballIndex) => {
            const isFloating = isSelected && ballIndex >= balls.length - floatCount;
            if (isFloating) return null; // These are rendered in the floating section
            
            return (
              <Ball
                key={`${index}-${ballIndex}`}
                color={color}
                index={ballIndex}
                isFloating={false}
              />
            );
          });
        })()}
      </div>

      {/* Tube number label */}
      <span className="text-sm sm:text-xs mt-1.5 sm:mt-1 opacity-60 font-bold">{index + 1}</span>

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

      {/* Perfect Move Effect */}
      <AnimatePresence>
        {isPerfect && (
          <motion.div
            className="perfect-move-label"
            initial={{ y: 20, opacity: 0, scale: 0.5 }}
            animate={{ y: -10, opacity: 1, scale: 1.2 }}
            exit={{ y: -30, opacity: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            PERFECT!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tube;
