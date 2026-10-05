import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_CONFIG } from '../../config/eventConfig';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { Lock, User, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const cleanInput = username.trim().toLowerCase();

    // Direct Admin Credentials Check for Kazanova
    const validUsernames = ['kazanova', 'kazanova@ieee-innovation.edu', 'admin', 'admin@ieee-innovation.edu'];
    const validPassword = 'Kazanova54321@';

    if (validUsernames.includes(cleanInput) && password === validPassword) {
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_username', username);
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    // Secondary Supabase Auth check
    if (isSupabaseConfigured) {
      try {
        const authEmail = cleanInput.includes('@') ? cleanInput : `${cleanInput}@ieee-innovation.edu`;
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (!authError) {
          sessionStorage.setItem('admin_authenticated', 'true');
          sessionStorage.setItem('admin_username', username);
          navigate('/admin/dashboard');
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback
      }
    }

    setError('Invalid admin username or password. Please check your credentials.');
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Top Return Link */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <a
            href="/"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Website
          </a>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Admin Auth
          </span>
        </div>

        {/* Centered Institutional Logo Badge */}
        <div className="flex justify-center pt-1">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-md border border-slate-700/50 flex items-center justify-center gap-4">
            <img
              src={EVENT_CONFIG.logos.iuLogo}
              alt="Innovation University"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="h-7 w-px bg-slate-200" />
            <img
              src={EVENT_CONFIG.logos.ieeeLogo}
              alt="IEEE Student Branch"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Administrator Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in to manage Web Development Journey submissions.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Admin Username / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kazanova"
                className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In as Admin'}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Protected single-admin portal. Authorized personnel only.
        </div>
      </div>
    </div>
  );
}
