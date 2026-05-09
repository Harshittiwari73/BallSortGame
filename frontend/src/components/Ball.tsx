import React from 'react';
import { motion } from 'framer-motion';

interface BallProps {
  color: number;
  isFloating?: boolean;
  index: number;
}

/**
 * Renders a single colored ball with gradient and shine effect
 */
const Ball: React.FC<BallProps> = ({ color, isFloating = false, index }) => {
  return (
    <motion.div
      className={`ball ball-${color} ${isFloating ? 'ball-floating' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.05 }}
      layout
      layoutId={`ball-${color}-${index}-${Math.random().toString(36).substr(2, 5)}`}
    />
  );
};

export default Ball;
