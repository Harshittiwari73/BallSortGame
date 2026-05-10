import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleDarkMode } from '../redux/uiSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Game header with level, moves, timer, coins, and controls
 * Fully responsive for mobile and desktop
 */
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { level, moves, timer } = useAppSelector((state) => state.game);
  const { darkMode } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.user);

  // Format timer as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="w-full p-2 sm:p-4">
      <div className="glass-card p-3 sm:p-4 flex items-center justify-between max-w-3xl mx-auto gap-2 sm:gap-4">
        {/* Left: Back & Level */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="btn-icon w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base"
            title="Back to Home"
          >
            ←
          </button>
          <div>
            <p className="text-[10px] sm:text-xs opacity-50 uppercase tracking-widest">Level</p>
            <p className="text-base sm:text-lg font-bold text-purple-500">{level}</p>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-1">
          <div className="text-center">
            <p className="text-[10px] sm:text-xs opacity-50">Moves</p>
            <p className="text-sm sm:text-lg font-semibold">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] sm:text-xs opacity-50">Time</p>
            <p className="text-sm sm:text-lg font-semibold font-mono">{formatTime(timer)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] sm:text-xs opacity-50">Coins</p>
            <p className="text-sm sm:text-lg font-semibold text-yellow-400">🪙 {user?.coins ?? 0}</p>
          </div>
        </div>

        {/* Right: Theme toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-icon w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base flex-shrink-0"
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
