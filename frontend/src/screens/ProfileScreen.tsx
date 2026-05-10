import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetProgress, updateProfile } from '../redux/userSlice';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.username);
  const [isUploading, setIsUploading] = useState(false);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      dispatch(resetProgress());
      navigate('/');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Please select an image under 2MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      dispatch(updateProfile({ avatarUrl: base64 }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remove profile photo?')) {
      dispatch(updateProfile({ avatarUrl: '' }));
    }
  };

  const handleSaveName = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      alert('Name cannot be empty.');
      return;
    }
    if (trimmed.length > 15) {
      alert('Name must be 15 characters or less.');
      return;
    }
    dispatch(updateProfile({ username: trimmed }));
    setIsEditingName(false);
  };

  return (
    <div className="game-bg min-h-[100dvh] overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg mx-auto">
        {/* Back header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <button onClick={() => navigate('/')} className="btn-icon w-10 h-10 sm:w-11 sm:h-11">←</button>
          <h1
            className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-2xl sm:text-3xl"
            style={{ fontFamily: 'Outfit' }}
          >
            My Stats
          </h1>
        </div>

        {/* Profile Header Card */}
        <motion.div
          className="glass-card text-center relative overflow-hidden p-6 sm:p-8 mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Avatar Section */}
          <div className="avatar-container w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4" onClick={() => fileInputRef.current?.click()}>
            <div className="avatar-glow inset-[-4px]"></div>
            <div className="avatar-image">
              {isUploading ? (
                <div className="animate-spin text-2xl">⏳</div>
              ) : user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="avatar-edit-badge w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm">📸</div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />

          <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight hover:text-purple-400 transition-colors">
                {user.username}
              </h2>
              <span className="text-xs sm:text-sm opacity-30">✏️</span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-purple-400/70">
              Master Sorter
            </p>

            {user.avatarUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-red-400 transition-all mt-1"
              >
                Remove Photo
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Level', value: user.currentLevel, color: 'text-purple-400', icon: '📊' },
            { label: 'Coins', value: user.coins, color: 'text-yellow-400', icon: '🪙' },
            { label: 'Wins', value: user.currentLevel - 1, color: 'text-green-400', icon: '✅' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card text-center relative hover:border-purple-500/30 transition-all p-3 sm:p-4"
            >
              <div className="text-lg sm:text-xl lg:text-2xl mb-1">{stat.icon}</div>
              <p className={`text-lg sm:text-xl lg:text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest opacity-40 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="glass-card p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight">🏅 Achievements</h3>
            <span className="text-[9px] sm:text-xs bg-white/5 px-2 py-0.5 rounded-full opacity-60">
              {Math.floor(([user.currentLevel > 1, false, user.currentLevel > 10, user.coins >= 100, user.currentLevel > 150].filter(Boolean).length / 5) * 100)}% Complete
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            {[
              { icon: '🎯', name: 'First Sort', desc: 'Complete your first level', done: user.currentLevel > 1 },
              { icon: '⚡', name: 'Speed Demon', desc: 'Complete a level in under 30s', done: false },
              { icon: '🧠', name: 'Sorting Pro', desc: 'Complete 10 levels', done: user.currentLevel > 10 },
              { icon: '💎', name: 'Rich Player', desc: 'Earn 100 coins', done: user.coins >= 100 },
              { icon: '🔥', name: 'Expert Sorter', desc: 'Complete a hard level', done: user.currentLevel > 150 },
            ].map((ach, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border ${ach.done ? 'border-green-500/20 bg-green-500/5 opacity-100' : 'border-white/5 bg-white/5 opacity-40'}`}
              >
                <span className="text-xl sm:text-2xl flex-shrink-0">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm tracking-tight">{ach.name}</p>
                  <p className="text-[10px] sm:text-xs opacity-50 font-medium">{ach.desc}</p>
                </div>
                {ach.done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center text-[9px] sm:text-[11px] text-white flex-shrink-0"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.button
          className="w-full p-3 sm:p-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-400/50 border border-red-500/10 rounded-xl hover:text-red-400 transition-all hover:border-red-500/30"
          onClick={handleReset}
          whileTap={{ scale: 0.98 }}
        >
          Reset All Progress
        </motion.button>
      </div>

      {/* Name Edit Modal */}
      <AnimatePresence>
        {isEditingName && (
          <div className="modal-backdrop">
            <motion.div
              className="glass-card w-full max-w-sm p-6 sm:p-8 rounded-2xl shadow-[0_0_100px_rgba(139,92,246,0.2)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                Change Nickname
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                <input
                  type="text"
                  className="input-field text-sm sm:text-base"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={15}
                  autoFocus
                />
                <div className="flex gap-2 sm:gap-3 mt-1">
                  <button
                    className="btn-secondary flex-1 py-2 sm:py-2.5 text-sm"
                    onClick={() => { setIsEditingName(false); setNewName(user.username); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary flex-1 py-2 sm:py-2.5 text-sm"
                    onClick={handleSaveName}
                  >
                    Save
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

export default ProfileScreen;
