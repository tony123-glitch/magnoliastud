import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.clients?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clients?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.session_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#c6b198] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">Projects</h1>
          <p className="text-white/50 text-sm">Manage all client bookings and deliveries.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131f24] border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#c6b198]/50 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="bg-[#131f24] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Client</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Session</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Date</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
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
                      project.status === 'Completed' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-white/10 text-white/80'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      project.payment_status === 'paid' ? 'bg-[#c6b198]/10 text-[#c6b198]' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {project.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
