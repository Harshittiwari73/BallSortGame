import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../redux/hooks';
// import { loginSuccess } from '../redux/userSlice';
// import { authService } from '../services/authService';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
//   const dispatch = useAppDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Login/Registration disabled - this code is kept only for compilation compatibility
      navigate('/');
    } catch (err: any) {
      setError('Login is currently disabled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-bg min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div 
        className="glass-card w-full max-w-[420px] p-8 sm:p-10 relative overflow-hidden flex flex-col" 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Decorative ambient lighting */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
        
        {/* Back button */}
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all mb-8 relative z-10 self-start">
          ←
        </button>
        
        <div className="relative z-10 flex flex-col w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-white/60">
              {isRegister ? 'Join us to save your progress and compete.' : 'Please enter your details to sign in.'}
            </p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 tracking-wider ml-1 uppercase">Username</label>
              <input type="text" className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-white/20 text-sm" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. ProSorter99" required minLength={3} />
            </div>
            
            {isRegister && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-1.5 overflow-hidden">
                <label className="text-xs font-semibold text-white/70 tracking-wider ml-1 uppercase mt-1">Email</label>
                <input type="email" className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-white/20 text-sm" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </motion.div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 tracking-wider ml-1 uppercase mt-1">Password</label>
              <input type="password" className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-white/20 text-sm" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold rounded-xl py-4 mt-4 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98]" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
          
          <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 text-sm">
            <span className="text-white/50">{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
            <button type="button" className="text-purple-400 font-semibold hover:text-purple-300 hover:underline transition-all" onClick={() => { setIsRegister(!isRegister); setError(null); }}>
              {isRegister ? 'Sign in instead' : 'Create one now'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
