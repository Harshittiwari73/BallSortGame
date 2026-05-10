import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleDarkMode, toggleSound, toggleMusic } from '../redux/uiSlice';
import { resetProgress } from '../redux/userSlice';
import { generateLevelConfig } from '../utils/puzzleGenerator';
import { loadLevel } from '../redux/gameSlice';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { darkMode, soundEnabled, musicEnabled } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.user);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePlay = () => {
    const currentLevelNum = user?.currentLevel ?? 1;
    const config = generateLevelConfig(currentLevelNum);
    dispatch(loadLevel({ level: currentLevelNum, data: config.data }));
    navigate('/game');
  };

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      dispatch(resetProgress());
      setIsSettingsOpen(false);
    }
  };

  return (
    <div
      className="game-bg overflow-x-hidden relative"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        padding: 'clamp(12px, 4vw, 32px) clamp(12px, 4vw, 24px)',
      }}
    >
      {/* Subtle Background Blobs */}
      <div className="bg-blob w-[400px] h-[400px] bg-purple-900/20 top-[-100px] left-[-100px]"></div>
      <div className="bg-blob w-[500px] h-[500px] bg-blue-900/20 bottom-[-150px] right-[-150px]" style={{ animationDelay: '-5s' }}></div>

      <div
        className="z-10 flex flex-col items-center"
        style={{
          width: '100%',
          maxWidth: '360px',
          gap: 'clamp(14px, 3.5vw, 32px)',
        }}
      >

        {/* Logo / Title Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="flex justify-center"
            style={{ gap: 'clamp(6px, 1.5vw, 8px)', marginBottom: 'clamp(10px, 3vw, 20px)' }}
          >
            {[1, 2, 3, 4, 5].map((color, i) => (
              <motion.div
                key={color}
                className={`ball ball-${color} shadow-lg`}
                style={{ width: 'clamp(18px, 5vw, 24px)', height: 'clamp(18px, 5vw, 24px)' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <h1
            className="font-black bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent tracking-tighter"
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(2.2rem, 11vw, 3.75rem)',
              lineHeight: 1.05,
              marginBottom: 'clamp(2px, 0.8vw, 4px)',
            }}
          >
            BALL SORT
          </h1>
          <p
            className="font-bold uppercase text-purple-400/80"
            style={{
              fontSize: 'clamp(8px, 2.2vw, 10px)',
              letterSpacing: 'clamp(0.3em, 1.5vw, 0.6em)',
              marginLeft: 'clamp(2px, 0.5vw, 4px)',
            }}
          >
            Puzzle Adventure
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="w-full flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="w-full flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-3xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: 'clamp(12px, 4vw, 20px)',
            }}
          >
            <div
              className="avatar-container"
              style={{
                width: 'clamp(60px, 18vw, 80px)',
                height: 'clamp(60px, 18vw, 80px)',
                marginBottom: 'clamp(8px, 2vw, 12px)',
              }}
              onClick={() => navigate('/profile')}
            >
              <div className="avatar-glow" style={{ opacity: 0.4 }}></div>
              <div className="avatar-image" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="text-center" style={{ marginBottom: 'clamp(8px, 2.5vw, 14px)' }}>
              <p
                className="font-medium opacity-40 uppercase tracking-widest"
                style={{ fontSize: 'clamp(8px, 2vw, 11px)', marginBottom: '2px' }}
              >
                Welcome back
              </p>
              <h2
                className="font-bold tracking-tight text-white/90"
                style={{ fontSize: 'clamp(15px, 4.5vw, 20px)' }}
              >
                {user.username}
              </h2>
            </div>

            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center" style={{ padding: 'clamp(8px, 2.5vw, 12px)' }}>
                <span
                  className="opacity-40 font-bold uppercase tracking-tighter"
                  style={{ fontSize: 'clamp(8px, 2vw, 11px)', marginBottom: '2px' }}
                >
                  Coins
                </span>
                <span
                  className="font-black text-yellow-500"
                  style={{ fontSize: 'clamp(13px, 4vw, 18px)' }}
                >
                  🪙 {user.coins}
                </span>
              </div>
              <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center" style={{ padding: 'clamp(8px, 2.5vw, 12px)' }}>
                <span
                  className="opacity-40 font-bold uppercase tracking-tighter"
                  style={{ fontSize: 'clamp(8px, 2vw, 11px)', marginBottom: '2px' }}
                >
                  Level
                </span>
                <span
                  className="font-black text-purple-400"
                  style={{ fontSize: 'clamp(13px, 4vw, 18px)' }}
                >
                  {user.currentLevel}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
          <motion.button
            className="menu-btn menu-btn-primary"
            style={{
              paddingTop: 'clamp(14px, 4vw, 18px)',
              paddingBottom: 'clamp(14px, 4vw, 18px)',
              fontSize: 'clamp(0.8rem, 4vw, 1rem)',
              letterSpacing: 'clamp(0.1em, 0.5vw, 0.2em)',
            }}
            onClick={handlePlay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🎮 Play Game
          </motion.button>

          <div className="flex flex-col" style={{ gap: 'clamp(6px, 1.5vw, 10px)' }}>
            <motion.button
              className="menu-btn menu-btn-secondary"
              onClick={() => navigate('/levels')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              📋 Select Level
            </motion.button>

            <div className="flex" style={{ gap: 'clamp(6px, 1.5vw, 10px)' }}>
              <motion.button
                className="menu-btn menu-btn-secondary flex-1"
                style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)' }}
                onClick={() => navigate('/leaderboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                🏆 Records
              </motion.button>
              <motion.button
                className="menu-btn menu-btn-secondary flex-1"
                style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)' }}
                onClick={() => navigate('/profile')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                👤 My Stats
              </motion.button>
            </div>
          </div>
        </div>

        {/* Settings Trigger */}
        <motion.button
          style={{
            width: 'clamp(40px, 10vw, 48px)',
            height: 'clamp(40px, 10vw, 48px)',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(16px, 4.5vw, 20px)',
            cursor: 'pointer',
          }}
          onClick={() => setIsSettingsOpen(true)}
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ⚙️
        </motion.button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="modal-backdrop">
            <motion.div
              className="glass-card border-white/10 shadow-2xl w-full"
              style={{
                maxWidth: 'min(380px, calc(100vw - 24px))',
                padding: 'clamp(20px, 5vw, 32px)',
                borderRadius: 'clamp(16px, 4vw, 24px)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: 'clamp(16px, 4vw, 28px)' }}>
                <h3 style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: 700, letterSpacing: '-0.02em' }}>Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="opacity-30 hover:opacity-100 transition-opacity">
                  <span style={{ fontSize: 'clamp(18px, 5vw, 24px)' }}>✕</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 3vw, 16px)' }}>
                {[
                  { label: 'Sound Effects', enabled: soundEnabled, toggle: () => dispatch(toggleSound()), color: 'bg-green-500' },
                  { label: 'Music', enabled: musicEnabled, toggle: () => dispatch(toggleMusic()), color: 'bg-green-500' },
                  { label: 'Dark Mode', enabled: darkMode, toggle: () => dispatch(toggleDarkMode()), color: 'bg-purple-600' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl"
                    style={{ padding: 'clamp(10px, 3vw, 14px)' }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 'clamp(12px, 3.5vw, 14px)', opacity: 0.8 }}>{item.label}</span>
                    <button
                      onClick={item.toggle}
                      className={`w-12 h-7 rounded-full transition-all relative ${item.enabled ? item.color : 'bg-white/10'}`}
                      style={{ minWidth: '48px' }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: item.enabled ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}

                <div style={{ paddingTop: 'clamp(8px, 2vw, 14px)' }}>
                  <button
                    onClick={handleReset}
                    className="w-full text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-2xl border border-red-500/10"
                    style={{
                      padding: 'clamp(12px, 3.5vw, 16px)',
                      fontSize: 'clamp(9px, 2.5vw, 11px)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                    }}
                  >
                    Reset Game Data
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
