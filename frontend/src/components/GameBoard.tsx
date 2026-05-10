import React, { useRef, useMemo } from 'react';
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

  // Maintain stable IDs for balls to enable smooth layout animations
  const ballIdsRef = useRef<string[][]>([]);
  const prevTubesRef = useRef<number[][]>([]);

  const currentIds = useMemo(() => {
    let newIds: string[][] = tubes.map(() => []);
    
    if (prevTubesRef.current.length === 0 || prevTubesRef.current.length !== tubes.length) {
      tubes.forEach((tube, i) => {
        tube.forEach((color, j) => {
          newIds[i][j] = `ball-${color}-${i}-${j}-${Math.random().toString(36).substring(2, 7)}`;
        });
      });
    } else {
      const lostBalls: { color: number, id: string }[] = [];
      const currentIds = ballIdsRef.current;
      
      for (let i = 0; i < tubes.length; i++) {
        const oldTube = prevTubesRef.current[i] || [];
        const newTube = tubes[i] || [];
        const oldIds = currentIds[i] || [];
        
        let matchCount = 0;
        while (matchCount < oldTube.length && matchCount < newTube.length && oldTube[matchCount] === newTube[matchCount]) {
          matchCount++;
        }
        
        for (let j = 0; j < matchCount; j++) {
          newIds[i][j] = oldIds[j];
        }
        
        for (let j = matchCount; j < oldTube.length; j++) {
          lostBalls.push({ color: oldTube[j], id: oldIds[j] });
        }
      }
      
      for (let i = 0; i < tubes.length; i++) {
        const oldTube = prevTubesRef.current[i] || [];
        const newTube = tubes[i] || [];
        
        let matchCount = 0;
        while (matchCount < oldTube.length && matchCount < newTube.length && oldTube[matchCount] === newTube[matchCount]) {
          matchCount++;
        }
        
        for (let j = matchCount; j < newTube.length; j++) {
          const color = newTube[j];
          const lostIndex = lostBalls.findIndex(b => b.color === color);
          if (lostIndex !== -1) {
            newIds[i][j] = lostBalls[lostIndex].id;
            lostBalls.splice(lostIndex, 1);
          } else {
            newIds[i][j] = `ball-${color}-${i}-${j}-${Math.random().toString(36).substring(2, 7)}`;
          }
        }
      }
    }
    
    ballIdsRef.current = newIds;
    prevTubesRef.current = tubes;
    return newIds;
  }, [tubes]);

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
      className="flex justify-center items-center w-full px-1 sm:px-4 py-2 sm:py-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`grid ${gridCols} gap-1.5 sm:gap-4 md:gap-5 lg:gap-6 max-w-full`}>
        {tubes.map((tube, index) => {
          const isValidTarget = selectedTube !== null && selectedTube !== index && isValidMove(tubes, selectedTube, index);

          return (
            <Tube
              key={index}
              balls={tube}
              ballIds={currentIds[index]}
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
