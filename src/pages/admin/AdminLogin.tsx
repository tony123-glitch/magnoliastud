import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1c2e36] p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-white mb-2">Admin Login</h1>
          <p className="text-[#c6b198] text-sm tracking-wide">Enter your credentials to access the portal.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-[#c6b198]/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#c6b198]/50 transition-colors"
              placeholder="admin@magnoliastudio.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-[#c6b198]/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#131f24] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#c6b198]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#c6b198] text-[#131f24] text-sm tracking-widest uppercase font-medium rounded-lg hover:bg-white transition-colors flex justify-center items-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
