import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { theme } from '../theme';

export default function AuthModal({ darkMode = true, onLoginSuccess }) {
  const currentTheme = darkMode ? theme.dark : theme.light;
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      setErrorMsg(result.error.message);
    } else {
      onLoginSuccess(result.data.user);
    }
    setLoading(false);
  }

  return (
    <div className={`fixed inset-0 ${currentTheme.bg.overlay} flex items-center justify-center p-4 z-50`}>
      <div className={`${currentTheme.bg.surface} rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border ${currentTheme.border.default} space-y-6`}>
        <div className="text-center space-y-1">
          <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isSignUp ? 'Create CareerPath Account' : 'Welcome Back'}
          </h2>
          <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {isSignUp ? 'Sign up to sync your applications across devices' : 'Sign in to access your job search dashboard'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-bold rounded-lg text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className={`block text-xs font-extrabold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
            />
          </div>

          <div>
            <label className={`block text-xs font-extrabold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 ${currentTheme.bg.surface} ${darkMode ? 'text-white' : 'text-slate-900'} border ${currentTheme.border.default} rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-black text-xs transition cursor-pointer ${
              loading ? 'bg-emerald-800 text-emerald-200 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className={`text-xs font-extrabold ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'} cursor-pointer`}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}