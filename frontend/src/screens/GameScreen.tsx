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
    <div
      className="game-bg overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      <Header />

      {/* Game board centered with flex-1 to fill remaining space */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        <GameBoard />
        <GameControls />
      </div>

      {/* Win modal */}
      <WinModal />
    </div>
  );
};

export default GameScreen;
