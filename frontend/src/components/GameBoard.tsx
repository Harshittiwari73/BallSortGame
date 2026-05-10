import React from 'react';
import { motion } from 'framer-motion';
import Tube from './Tube';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectTube } from '../redux/gameSlice';
import { isValidMove } from '../utils/gameLogic';

/**
 * Game board - renders all tubes in a responsive grid layout
 * Tubes scale with viewport on mobile to prevent overflow
 */
const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tubes, selectedTube, hintFrom, hintTo, perfectTubeIndex } = useAppSelector((state) => state.game);

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
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 'clamp(12px, 3vw, 28px) clamp(10px, 3vw, 16px)',
        overflowX: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`grid ${gridCols}`}
        style={{ gap: 'clamp(8px, 2.5vw, 20px)' }}
      >
        {tubes.map((tube, index) => {
          const isValidTarget = selectedTube !== null && selectedTube !== index && isValidMove(tubes, selectedTube, index);

          return (
            <Tube
              key={index}
              balls={tube}
              index={index}
              isSelected={selectedTube === index}
              isValidTarget={isValidTarget}
              isHintFrom={hintFrom === index}
              isHintTo={hintTo === index}
              isPerfect={perfectTubeIndex === index}
              onClick={() => handleTubeClick(index)}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default GameBoard;
