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
    <div className="game-bg min-h-screen flex flex-col items-center justify-center py-8 px-6 overflow-hidden relative">
      
      {/* Subtle Background Blobs */}
      <div className="bg-blob w-[400px] h-[400px] bg-purple-900/20 top-[-100px] left-[-100px]"></div>
      <div className="bg-blob w-[500px] h-[500px] bg-blue-900/20 bottom-[-150px] right-[-150px]" style={{ animationDelay: '-5s' }}></div>

      <div className="w-full max-w-sm flex flex-col items-center z-10 gap-10">
        
        {/* Refined Header Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((color, i) => (
              <motion.div
                key={color}
                className={`ball ball-${color} shadow-lg`}
                style={{ width: 24, height: 24 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-1 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent tracking-tighter" style={{ fontFamily: 'Outfit' }}>
            BALL SORT
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-purple-400/80 ml-2">Puzzle Adventure</p>
        </motion.div>

        {/* Cleaner Profile Section */}
        <motion.div
          className="w-full flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card-compact p-5 w-full flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="avatar-container !w-[80px] !h-[80px] !mb-3" onClick={() => navigate('/profile')}>
              <div className="avatar-glow !opacity-40 !inset-[-4px]"></div>
              <div className="avatar-image !border-white/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-xs font-medium opacity-40 uppercase tracking-widest mb-1">Welcome back</p>
              <h2 className="text-xl font-bold tracking-tight text-white/90">{user.username}</h2>
            </div>

            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center">
                <span className="text-xs opacity-40 font-bold uppercase tracking-tighter mb-1">Coins</span>
                <span className="text-lg font-black text-yellow-500">🪙 {user.coins}</span>
              </div>
              <div className="flex-1 bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center">
                <span className="text-xs opacity-40 font-bold uppercase tracking-tighter mb-1">Level</span>
                <span className="text-lg font-black text-purple-400">{user.currentLevel}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Refined Menu Buttons */}
        <div className="w-full flex flex-col gap-3">
          <motion.button
            className="menu-btn menu-btn-primary !py-4.5 !text-lg !tracking-[0.2em]"
            onClick={handlePlay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🎮 Play Game
          </motion.button>

          <div className="grid grid-cols-1 gap-2.5">
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

            <div className="flex gap-2.5">
              <motion.button
                className="menu-btn menu-btn-secondary flex-1 !text-[11px]"
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
                className="menu-btn menu-btn-secondary flex-1 !text-[11px]"
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
          className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xl shadow-lg"
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
              className="glass-card p-8 w-full max-w-sm border-white/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold tracking-tight">Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="opacity-30 hover:opacity-100 transition-opacity">
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Sound Effects', enabled: soundEnabled, toggle: () => dispatch(toggleSound()), color: 'bg-green-500' },
                  { label: 'Music', enabled: musicEnabled, toggle: () => dispatch(toggleMusic()), color: 'bg-green-500' },
                  { label: 'Dark Mode', enabled: darkMode, toggle: () => dispatch(toggleDarkMode()), color: 'bg-purple-600' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="font-semibold text-sm opacity-80">{item.label}</span>
                    <button 
                      onClick={item.toggle}
                      className={`w-12 h-7 rounded-full transition-all relative ${item.enabled ? item.color : 'bg-white/10'}`}
                    >
                      <motion.div 
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: item.enabled ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <button 
                    onClick={handleReset}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-2xl border border-red-500/10"
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
