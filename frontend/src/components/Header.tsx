import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleDarkMode } from '../redux/uiSlice';
import { useNavigate } from 'react-router-dom';
import { DIFFICULTY_PRESETS } from '../utils/puzzleGenerator';

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine difficulty tier
  let difficulty: number;
  if (level <= 50) difficulty = 1;
  else if (level <= 200) difficulty = 2;
  else if (level <= 400) difficulty = 3;
  else if (level <= 700) difficulty = 4;
  else difficulty = 5;

  const preset = DIFFICULTY_PRESETS[difficulty as keyof typeof DIFFICULTY_PRESETS];

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
            <div className="flex items-center gap-2">
              <p className="text-[10px] sm:text-xs opacity-50 uppercase tracking-widest">Level</p>
              <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-wider bg-white/5 border border-white/10 ${preset.colorClass} shadow-[0_0_10px_rgba(0,0,0,0)] transition-all duration-300 ${preset.glowClass}`}>
                {preset.name}
              </span>
            </div>
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
