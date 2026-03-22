import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2, Key } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export function ClientPortalLogin() {
  const [email, setEmail] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Find client by email and client_native_id
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .eq('client_native_id', clientId);

      if (clientError) throw clientError;

      if (!clients || clients.length === 0) {
        throw new Error("Invalid credentials or project not found.");
      }

      const clientRecord = clients[0];

      // Store in local storage to keep "session" active
      localStorage.setItem('portal_client_id', clientRecord.id);
      localStorage.setItem('portal_native_id', clientId);
      
      // Redirect to portal
      navigate('/portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to access portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onBookClick={() => {}} />
      <div className="flex-1 bg-background min-h-screen py-24 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#131f24] p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c6b198]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative text-center mb-10">
            <div className="w-16 h-16 bg-[#c6b198]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-6 h-6 text-[#c6b198]" />
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">Client Portal</h1>
            <p className="text-[#c6b198] text-sm tracking-wide font-light">Enter your email and private Client ID to access your gallery.</p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#c6b198]/80 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c2e36] border border-white/10 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-[#c6b198]/50 transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#c6b198]/80 ml-1">Client ID</label>
              <input
                type="text"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-[#1c2e36] border border-white/10 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-[#c6b198]/50 transition-colors uppercase font-mono tracking-wider"
                placeholder="CL-2026-XXXXXX"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#c6b198] text-[#131f24] text-sm tracking-widest uppercase font-medium rounded-xl hover:bg-white transition-colors flex justify-center items-center disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Gallery"}
            </button>
          </form>
        </div>
      </div>
      <Footer onBookClick={() => {}} />
    </>
  );
}
