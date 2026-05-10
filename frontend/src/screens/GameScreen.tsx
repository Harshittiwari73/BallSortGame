import React, { useEffect } from 'react';
import Header from '../components/Header';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import WinModal from '../components/WinModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { startPlaying, tick } from '../redux/gameSlice';

/**
 * Main game screen with header, board, controls, and win modal
 */
const GameScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPlaying, isWon } = useAppSelector((state) => state.game);

  // Start playing on mount
  useEffect(() => {
    dispatch(startPlaying());
  }, [dispatch]);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon, dispatch]);

  return (
    <div className="game-bg min-h-[100dvh] flex flex-col overflow-hidden">
      <Header />

      {/* Game board centered with flex-1 to fill remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full relative">
        <GameBoard />
        <div className="w-full max-w-md px-2 sm:px-4 pb-4">
          <GameControls />
        </div>
      </div>

      {/* Win modal */}
      <WinModal />
    </div>
  );
};

export default GameScreen;
