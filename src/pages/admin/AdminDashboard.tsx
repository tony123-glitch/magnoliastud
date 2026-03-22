import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Users, Calendar, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeBookings: 0,
    readyForDelivery: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: activeBookings } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'Booked');
      const { count: readyForDelivery } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'Ready for Delivery');

      setStats({
        totalProjects: totalProjects || 0,
        activeBookings: activeBookings || 0,
        readyForDelivery: readyForDelivery || 0,
      });

      // Fetch recent projects
      const { data } = await supabase
        .from('projects')
        .select('*, clients(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentProjects(data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#c6b198] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-white mb-2">Overview</h1>
        <p className="text-white/50 text-sm">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#131f24] border border-white/5 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#c6b198]/10 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#c6b198]" />
          </div>
          <div>
            <p className="text-sm text-white/50 uppercase tracking-widest">Active Bookings</p>
            <p className="text-3xl font-serif text-white mt-1">{stats.activeBookings}</p>
          </div>
        </div>
        <div className="bg-[#131f24] border border-white/5 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#c6b198]/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-[#c6b198]" />
          </div>
          <div>
            <p className="text-sm text-white/50 uppercase tracking-widest">Ready for Delivery</p>
            <p className="text-3xl font-serif text-white mt-1">{stats.readyForDelivery}</p>
          </div>
        </div>
        <div className="bg-[#131f24] border border-white/5 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#c6b198]/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-[#c6b198]" />
          </div>
          <div>
            <p className="text-sm text-white/50 uppercase tracking-widest">Total Projects</p>
            <p className="text-3xl font-serif text-white mt-1">{stats.totalProjects}</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */ }
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white">Recent Bookings</h2>
          <Link to="/admin/projects" className="text-sm text-[#c6b198] hover:text-white transition-colors">View All</Link>
        </div>
        <div className="bg-[#131f24] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Client</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Session</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Date</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <Link to={`/admin/projects/${project.id}`} className="block">
                      <p className="text-white font-medium group-hover:text-[#c6b198] transition-colors">{project.clients?.full_name}</p>
                      <p className="text-white/40 text-sm">{project.clients?.email}</p>
                    </Link>
                  </td>
                  <td className="p-4 text-white/80">{project.session_type}</td>
                  <td className="p-4 text-white/80">{project.preferred_date || 'TBD'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      project.status === 'Booked' ? 'bg-blue-500/10 text-blue-400' :
                      project.status === 'Ready for Delivery' ? 'bg-green-500/10 text-green-400' :
                      'bg-white/10 text-white/80'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentProjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/40">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
