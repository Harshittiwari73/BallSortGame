import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleDarkMode } from '../redux/uiSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Game header with level, moves, timer, coins, and controls
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
    <header className="w-full px-4 py-3">
      <div className="glass-card px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
        {/* Left: Back & Level */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-icon"
            title="Back to Home"
          >
            ←
          </button>
          <div>
            <p className="text-xs opacity-50 uppercase tracking-wider">Level</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{level}</p>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs opacity-50">Moves</p>
            <p className="text-lg font-semibold">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-50">Time</p>
            <p className="text-lg font-semibold font-mono">{formatTime(timer)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-50">Coins</p>
            <p className="text-lg font-semibold text-yellow-400">🪙 {user?.coins ?? 0}</p>
          </div>
        </div>

        {/* Right: Theme toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-icon"
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
