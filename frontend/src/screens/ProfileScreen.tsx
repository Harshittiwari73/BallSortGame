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

    // Validation
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
    <div className="game-bg min-h-screen px-4 py-8 overflow-x-hidden">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/')} className="btn-icon">←</button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: 'Outfit' }}>
            My Stats
          </h1>
        </div>

        {/* Profile Header Card */}
        <motion.div 
          className="glass-card p-8 text-center mb-8 relative overflow-hidden" 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Avatar Section */}
          <div className="avatar-container" onClick={() => fileInputRef.current?.click()}>
            <div className="avatar-glow"></div>
            <div className="avatar-image">
              {isUploading ? (
                <div className="animate-spin text-2xl">⏳</div>
              ) : user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="avatar-edit-badge">
              📸
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp" 
          />

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h2 className="text-3xl font-extrabold tracking-tight group-hover:text-purple-400 transition-colors">
                {user.username}
              </h2>
              <span className="text-sm opacity-30 group-hover:opacity-100 transition-opacity">✏️</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/70">Master Sorter</p>
            
            {user.avatarUrl && (
              <button onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }} className="text-[10px] uppercase tracking-tighter opacity-30 hover:opacity-100 mt-2 hover:text-red-400 transition-all">
                Remove Photo
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-8" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Level', value: user.currentLevel, color: 'text-purple-400', icon: '📊' },
            { label: 'Coins', value: user.coins, color: 'text-yellow-400', icon: '🪙' },
            { label: 'Wins', value: user.currentLevel - 1, color: 'text-green-400', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5 text-center relative group hover:border-purple-500/30 transition-all">
              <div className="text-xl mb-1">{stat.icon}</div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="glass-card p-8 mb-8" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold tracking-tight">🏅 Achievements</h3>
            <span className="text-xs bg-white/5 px-2 py-1 rounded-full opacity-60">
              {Math.floor(([user.currentLevel > 1, false, user.currentLevel > 10, user.coins >= 100, user.currentLevel > 150].filter(Boolean).length / 5) * 100)}% Complete
            </span>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: '🎯', name: 'First Sort', desc: 'Complete your first level', done: user.currentLevel > 1 },
              { icon: '⚡', name: 'Speed Demon', desc: 'Complete a level in under 30s', done: false },
              { icon: '🧠', name: 'Sorting Pro', desc: 'Complete 10 levels', done: user.currentLevel > 10 },
              { icon: '💎', name: 'Rich Player', desc: 'Earn 100 coins', done: user.coins >= 100 },
              { icon: '🔥', name: 'Expert Sorter', desc: 'Complete a hard level', done: user.currentLevel > 150 },
            ].map((ach, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  ach.done ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'bg-white/5 border-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl">{ach.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm tracking-tight">{ach.name}</p>
                  <p className="text-xs opacity-50 font-medium">{ach.desc}</p>
                </div>
                {ach.done && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white">
                    ✓
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.button 
          className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-red-400/50 hover:text-red-400 transition-all border border-red-500/10 hover:border-red-500/30 rounded-xl" 
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
              className="glass-card p-8 w-full max-w-sm shadow-[0_0_100px_rgba(139,92,246,0.2)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-6">Change Nickname</h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  className="input-field text-lg" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={15}
                  autoFocus
                />
                <div className="flex gap-3 mt-2">
                  <button className="btn-secondary flex-1 py-3" onClick={() => { setIsEditingName(false); setNewName(user.username); }}>
                    Cancel
                  </button>
                  <button className="btn-primary flex-1 py-3" onClick={handleSaveName}>
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
