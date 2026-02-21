import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Moon, Sparkles, History, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Login from './components/Login';
import DreamInput from './components/DreamInput';
import DreamHistory from './components/DreamHistory';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0502] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-indigo-400 font-serif italic text-2xl"
        >
          Entering the Dreamscape...
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-indigo-500/30">
        {/* Atmospheric Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        </div>

        {user && (
          <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 group-hover:bg-indigo-600/30 transition-colors">
                  <Moon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-serif italic text-xl tracking-tight">SOMNOVA</span>
              </Link>

              <div className="flex items-center gap-6">
                <Link to="/history" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <History className="w-4 h-4" />
                  <span>Past Dreams</span>
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-tighter">Logged in as</span>
                    <span className="text-sm font-medium text-gray-300">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <DreamInput /> : <Navigate to="/login" />} />
              <Route path="/history" element={user ? <DreamHistory /> : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="relative z-10 py-12 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              <span>Powered by Gemini AI</span>
            </div>
            <p className="text-gray-600 text-[10px] text-center max-w-xs">
              Dreams are the language of the soul. We help you translate the whispers of the night into stories that last.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
