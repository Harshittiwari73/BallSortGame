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
    <header style={{ width: '100%', padding: 'clamp(8px, 2.5vw, 12px) clamp(10px, 3vw, 16px)' }}>
      <div
        className="glass-card"
        style={{
          padding: 'clamp(8px, 2.5vw, 12px) clamp(10px, 3vw, 16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '720px',
          margin: '0 auto',
          gap: 'clamp(6px, 2vw, 12px)',
        }}
      >
        {/* Left: Back & Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 12px)', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/')}
            className="btn-icon"
            title="Back to Home"
            style={{ flexShrink: 0 }}
          >
            ←
          </button>
          <div>
            <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level</p>
            <p style={{ fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 700, color: 'var(--accent)' }}>{level}</p>
          </div>
        </div>

        {/* Center: Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 3.5vw, 24px)',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div className="text-center">
            <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', opacity: 0.5 }}>Moves</p>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: 600 }}>{moves}</p>
          </div>
          <div className="text-center">
            <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', opacity: 0.5 }}>Time</p>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: 600, fontFamily: 'monospace' }}>{formatTime(timer)}</p>
          </div>
          <div className="text-center">
            <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', opacity: 0.5 }}>Coins</p>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: 600, color: '#facc15' }}>🪙 {user?.coins ?? 0}</p>
          </div>
        </div>

        {/* Right: Theme toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-icon"
          title="Toggle Theme"
          style={{ flexShrink: 0 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
