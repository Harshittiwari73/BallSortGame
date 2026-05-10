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
    <div className="game-bg min-h-[100dvh] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden relative">
      {/* Subtle Background Blobs */}
      <div className="bg-blob w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-900/20 top-[-50px] sm:top-[-100px] left-[-50px] sm:left-[-100px]"></div>
      <div className="bg-blob w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-900/20 bottom-[-100px] sm:bottom-[-150px] right-[-100px] sm:right-[-150px]" style={{ animationDelay: '-5s' }}></div>

      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center z-10 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Logo / Title Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
            {[1, 2, 3, 4, 5].map((color, i) => (
              <motion.div
                key={color}
                className={`ball ball-${color} shadow-lg w-5 h-5 sm:w-6 sm:h-6`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-0.5 sm:mb-1 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent tracking-tighter leading-none" style={{ fontFamily: 'Outfit' }}>
            BALL SORT
          </h1>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.6em] text-purple-400/80 ml-1">
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
          <div className="glass-card w-full flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
            <div className="avatar-container w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3" onClick={() => navigate('/profile')}>
              <div className="avatar-glow opacity-40 inset-[-3px] sm:inset-[-4px]"></div>
              <div className="avatar-image border-white/20 text-xl sm:text-2xl">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-[10px] sm:text-xs font-medium opacity-40 uppercase tracking-widest mb-0.5">Welcome back</p>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">{user.username}</h2>
            </div>

            <div className="flex gap-2 sm:gap-2 w-full">
              <div className="flex-1 bg-white/[0.03] border border-white/5 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center">
                <span className="text-[9px] sm:text-xs opacity-40 font-bold uppercase tracking-tighter mb-0.5">Coins</span>
                <span className="text-sm sm:text-lg font-black text-yellow-500">🪙 {user.coins}</span>
              </div>
              <div className="flex-1 bg-white/[0.03] border border-white/5 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center">
                <span className="text-[9px] sm:text-xs opacity-40 font-bold uppercase tracking-tighter mb-0.5">Level</span>
                <span className="text-sm sm:text-lg font-black text-purple-400">{user.currentLevel}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <motion.button
            className="menu-btn menu-btn-primary py-3 sm:py-4 text-base sm:text-lg tracking-widest sm:tracking-[0.2em] rounded-xl sm:rounded-2xl"
            onClick={handlePlay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🎮 Play Game
          </motion.button>

          <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
            <motion.button
              className="menu-btn menu-btn-secondary py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl"
              onClick={() => navigate('/levels')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              📋 Select Level
            </motion.button>

            <div className="flex gap-2 sm:gap-2.5">
              <motion.button
                className="menu-btn menu-btn-secondary flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs rounded-xl sm:rounded-2xl"
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
                className="menu-btn menu-btn-secondary flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs rounded-xl sm:rounded-2xl"
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
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-lg sm:text-xl shadow-lg mt-1 sm:mt-0"
          onClick={() => setIsSettingsOpen(true)}
          whileHover={{ rotate: 90, background: 'rgba(255,255,255,0.08)' }}
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
              className="glass-card p-6 sm:p-8 w-full max-w-sm sm:max-w-sm border-white/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="opacity-30 hover:opacity-100 transition-opacity">
                  <span className="text-xl sm:text-2xl">✕</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {[
                  { label: 'Sound Effects', enabled: soundEnabled, toggle: () => dispatch(toggleSound()), color: 'bg-green-500' },
                  { label: 'Music', enabled: musicEnabled, toggle: () => dispatch(toggleMusic()), color: 'bg-green-500' },
                  { label: 'Dark Mode', enabled: darkMode, toggle: () => dispatch(toggleDarkMode()), color: 'bg-purple-600' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 sm:p-3 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl">
                    <span className="font-semibold text-xs sm:text-sm opacity-80">{item.label}</span>
                    <button 
                      onClick={item.toggle}
                      className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-all relative ${item.enabled ? item.color : 'bg-white/10'}`}
                    >
                      <motion.div 
                        className="absolute top-1 left-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"
                        animate={{ x: item.enabled ? 16 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-3 sm:pt-4">
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-xl sm:rounded-2xl border border-red-500/10"
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
