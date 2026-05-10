import React, { useEffect } from 'react';
import Header from '../components/Header';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import WinModal from '../components/WinModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { startPlaying, tick, setPaused } from '../redux/gameSlice';
import PauseOverlay from '../components/PauseOverlay';

/**
 * Main game screen with header, board, controls, and win modal
 */
const GameScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPlaying, isWon, isPaused } = useAppSelector((state) => state.game);

  // Start playing on mount
  useEffect(() => {
    dispatch(startPlaying());
  }, [dispatch]);

  // Smart Pause: Visibility and Focus tracking
  useEffect(() => {
    if (!isPlaying || isWon) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch(setPaused(true));
      } else {
        dispatch(setPaused(false));
      }
    };

    const handleBlur = () => {
      dispatch(setPaused(true));
    };

    const handleFocus = () => {
      // Only unpause if the document is actually visible
      if (!document.hidden) {
        dispatch(setPaused(false));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isPlaying, isWon, dispatch]);

  // Timer interval - completely clears when paused to save battery/performance
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isWon && !isPaused) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon, isPaused, dispatch]);

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

      {/* Smart Pause Overlay */}
      <PauseOverlay />
    </div>
  );
};

export default GameScreen;
