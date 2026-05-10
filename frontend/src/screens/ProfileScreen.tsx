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
    <div
      className="game-bg overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3.5vw, 16px)',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        {/* Back header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 3vw, 16px)',
            marginBottom: 'clamp(16px, 5vw, 36px)',
          }}
        >
          <button onClick={() => navigate('/')} className="btn-icon">←</button>
          <h1
            className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(1.4rem, 7vw, 2rem)',
              fontWeight: 700,
            }}
          >
            My Stats
          </h1>
        </div>

        {/* Profile Header Card */}
        <motion.div
          className="glass-card text-center relative overflow-hidden"
          style={{ padding: 'clamp(20px, 5vw, 32px)', marginBottom: 'clamp(14px, 4vw, 28px)' }}
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
            <div className="avatar-edit-badge">📸</div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', marginTop: 'clamp(8px, 2vw, 12px)' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setIsEditingName(true)}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.3rem, 6vw, 1.875rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
                className="hover:text-purple-400 transition-colors"
              >
                {user.username}
              </h2>
              <span style={{ fontSize: '0.875rem', opacity: 0.3 }}>✏️</span>
            </div>
            <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(167,139,250,0.7)' }}>
              Master Sorter
            </p>

            {user.avatarUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                style={{ fontSize: 'clamp(9px, 2.3vw, 11px)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.3, marginTop: '4px' }}
                className="hover:opacity-100 hover:text-red-400 transition-all"
              >
                Remove Photo
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(8px, 2.5vw, 16px)',
            marginBottom: 'clamp(14px, 4vw, 28px)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Level', value: user.currentLevel, color: '#a78bfa', icon: '📊' },
            { label: 'Coins', value: user.coins, color: '#facc15', icon: '🪙' },
            { label: 'Wins', value: user.currentLevel - 1, color: '#4ade80', icon: '✅' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card text-center relative hover:border-purple-500/30 transition-all"
              style={{ padding: 'clamp(12px, 3.5vw, 20px) clamp(8px, 2vw, 12px)' }}
            >
              <div style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', marginBottom: '4px' }}>{stat.icon}</div>
              <p style={{ fontSize: 'clamp(1.1rem, 5vw, 1.5rem)', fontWeight: 900, color: stat.color }}>{stat.value}</p>
              <p style={{ fontSize: 'clamp(8px, 2vw, 10px)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.4, marginTop: '4px' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="glass-card"
          style={{ padding: 'clamp(16px, 4.5vw, 32px)', marginBottom: 'clamp(14px, 4vw, 28px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(12px, 3.5vw, 24px)' }}>
            <h3 style={{ fontSize: 'clamp(14px, 4vw, 20px)', fontWeight: 700, letterSpacing: '-0.01em' }}>🏅 Achievements</h3>
            <span style={{ fontSize: 'clamp(9px, 2.2vw, 12px)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '999px', opacity: 0.6 }}>
              {Math.floor(([user.currentLevel > 1, false, user.currentLevel > 10, user.coins >= 100, user.currentLevel > 150].filter(Boolean).length / 5) * 100)}% Complete
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2.5vw, 16px)' }}>
            {[
              { icon: '🎯', name: 'First Sort', desc: 'Complete your first level', done: user.currentLevel > 1 },
              { icon: '⚡', name: 'Speed Demon', desc: 'Complete a level in under 30s', done: false },
              { icon: '🧠', name: 'Sorting Pro', desc: 'Complete 10 levels', done: user.currentLevel > 10 },
              { icon: '💎', name: 'Rich Player', desc: 'Earn 100 coins', done: user.coins >= 100 },
              { icon: '🔥', name: 'Expert Sorter', desc: 'Complete a hard level', done: user.currentLevel > 150 },
            ].map((ach, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(10px, 3vw, 16px)',
                  padding: 'clamp(10px, 3vw, 16px)',
                  borderRadius: '12px',
                  border: `1px solid ${ach.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  background: ach.done ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.05)',
                  opacity: ach.done ? 1 : 0.4,
                }}
              >
                <span style={{ fontSize: 'clamp(20px, 5vw, 28px)', flexShrink: 0 }}>{ach.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 'clamp(12px, 3vw, 14px)', letterSpacing: '-0.01em' }}>{ach.name}</p>
                  <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', opacity: 0.5, fontWeight: 500 }}>{ach.desc}</p>
                </div>
                {ach.done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: 'clamp(20px, 5vw, 24px)',
                      height: 'clamp(20px, 5vw, 24px)',
                      background: '#22c55e',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(8px, 2.2vw, 11px)',
                      color: 'white',
                      flexShrink: 0,
                    }}
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
          style={{
            width: '100%',
            padding: 'clamp(12px, 3.5vw, 16px)',
            fontSize: 'clamp(9px, 2.5vw, 12px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(248,113,113,0.5)',
            border: '1px solid rgba(239,68,68,0.1)',
            borderRadius: '12px',
          }}
          className="hover:text-red-400 transition-all hover:border-red-500/30"
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
              className="glass-card w-full"
              style={{
                maxWidth: 'min(380px, calc(100vw - 24px))',
                padding: 'clamp(20px, 5vw, 32px)',
                borderRadius: 'clamp(16px, 4vw, 24px)',
                boxShadow: '0 0 100px rgba(139,92,246,0.2)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: 700, marginBottom: 'clamp(16px, 4vw, 24px)' }}>
                Change Nickname
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
                <input
                  type="text"
                  className="input-field"
                  style={{ fontSize: 'clamp(14px, 4vw, 18px)' }}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={15}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', marginTop: '4px' }}>
                  <button
                    className="btn-secondary flex-1"
                    style={{ padding: 'clamp(10px, 3vw, 12px)' }}
                    onClick={() => { setIsEditingName(false); setNewName(user.username); }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary flex-1"
                    style={{ padding: 'clamp(10px, 3vw, 12px)' }}
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
