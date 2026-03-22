import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Users, LogOut, Loader2 } from 'lucide-react';

export function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/admin/login');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c6b198] animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#0f191d] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#131f24] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h2 className="font-serif text-2xl text-[#c6b198]">Magnolia Studio</h2>
          <p className="text-xs tracking-widest uppercase text-white/40 mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/admin' ? 'bg-[#c6b198]/10 text-[#c6b198]' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link
            to="/admin/projects"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname.startsWith('/admin/projects') ? 'bg-[#c6b198]/10 text-[#c6b198]' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Projects</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
