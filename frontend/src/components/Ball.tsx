import React from 'react';
import { motion } from 'framer-motion';

interface BallProps {
  id: string;
  color: number;
  isFloating?: boolean;
  index: number;
}

/**
 * Renders a single colored ball with gradient and shine effect
 */
const Ball: React.FC<BallProps> = ({ id, color, isFloating = false, index }) => {
  return (
    <motion.div
      className={`ball ball-${color} ${isFloating ? 'ball-floating' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.05 }}
      layout
      layoutId={id}
    />
  );
};

export default Ball;
