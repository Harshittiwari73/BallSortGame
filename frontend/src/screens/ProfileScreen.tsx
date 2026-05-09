import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetProgress } from '../redux/userSlice';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      dispatch(resetProgress());
      navigate('/');
    }
  };

  return (
    <div className="game-bg min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="btn-icon">←</button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: 'Outfit' }}>
            My Stats
          </h1>
        </div>

        {/* Avatar & Name */}
        <motion.div className="glass-card p-6 text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-sm opacity-50">Local Profile</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-3 gap-3 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">🪙 {user.coins}</p>
            <p className="text-xs opacity-50 mt-1">Coins</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">📊 {user.currentLevel}</p>
            <p className="text-xs opacity-50 mt-1">Level</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">✅ {user.currentLevel - 1}</p>
            <p className="text-xs opacity-50 mt-1">Wins</p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div className="glass-card p-6 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold mb-4">🏅 Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: '🎯', name: 'First Sort', desc: 'Complete your first level', done: user.currentLevel > 1 },
              { icon: '⚡', name: 'Speed Demon', desc: 'Complete a level in under 30s', done: false },
              { icon: '🧠', name: 'Sorting Pro', desc: 'Complete 10 levels', done: user.currentLevel > 10 },
              { icon: '💎', name: 'Rich Player', desc: 'Earn 100 coins', done: user.coins >= 100 },
              { icon: '🔥', name: 'Expert Sorter', desc: 'Complete a hard level', done: user.currentLevel > 150 },
            ].map((ach, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${ach.done ? 'bg-green-500/10' : 'opacity-40'}`}>
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{ach.name}</p>
                  <p className="text-xs opacity-60">{ach.desc}</p>
                </div>
                {ach.done && <span className="text-green-400">✓</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.button className="btn-secondary w-full py-3 text-red-400 border-red-500/30" onClick={handleReset} whileTap={{ scale: 0.97 }}>
          🔄 Reset All Progress
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileScreen;
