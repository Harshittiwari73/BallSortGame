import React from 'react';
import { motion } from 'framer-motion';
import Tube from './Tube';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectTube } from '../redux/gameSlice';

/**
 * Game board - renders all tubes in a responsive grid layout
 */
const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tubes, selectedTube, hintFrom, hintTo } = useAppSelector((state) => state.game);

  const handleTubeClick = (index: number) => {
    dispatch(selectTube(index));
  };

  // Calculate grid layout based on number of tubes
  const tubeCount = tubes.length;
  let gridCols = 'grid-cols-4';
  if (tubeCount <= 4) gridCols = 'grid-cols-4';
  else if (tubeCount <= 5) gridCols = 'grid-cols-5';
  else if (tubeCount <= 7) gridCols = 'grid-cols-4';
  else gridCols = 'grid-cols-5';

  return (
    <motion.div
      className="flex justify-center items-center w-full px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {tubes.map((tube, index) => (
          <Tube
            key={index}
            balls={tube}
            index={index}
            isSelected={selectedTube === index}
            isHintFrom={hintFrom === index}
            isHintTo={hintTo === index}
            onClick={() => handleTubeClick(index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default GameBoard;
