import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, UploadCloud, CheckCircle2, FileImage, Trash2, Key } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function AdminProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchAssets();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .eq('project_id', id)
      .order('uploaded_at', { ascending: false });
    if (data) setAssets(data);
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setProject({ ...project, status: newStatus });
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const generateNativeId = () => {
    const year = new Date().getFullYear();
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CL-${year}-${hash}`;
  };

  const markAsDone = async () => {
    try {
      setLoading(true);
      // Generate client ID if one doesn't exist
      let nativeId = project.clients.client_native_id;
      if (!nativeId) {
        nativeId = generateNativeId();
        const { error: clientError } = await supabase
          .from('clients')
          .update({ client_native_id: nativeId })
          .eq('id', project.client_id);
        if (clientError) throw clientError;
      }

      // Update project status to Ready for Delivery
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'Ready for Delivery', delivery_ready: true })
        .eq('id', id);

      if (projectError) throw projectError;

      // Refresh
      await fetchProject();
    } catch (err: any) {
      alert('Failed to finalize delivery: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let newAssets = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${project.client_id}/${id}/${fileName}`;
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      try {
        const { error: uploadError } = await supabase.storage
          .from('client-assets')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // Insert into assets table
        const { data: assetData, error: dbError } = await supabase
          .from('assets')
          .insert([{
            project_id: id,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type
          }]).select().single();

        if (dbError) throw dbError;
        if (assetData) newAssets.push(assetData);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (err: any) {
        console.error('Error uploading file:', err);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 })); // Error state
      }
    }

    setAssets(prev => [...newAssets, ...prev]);
    setUploading(false);
    setTimeout(() => setUploadProgress({}), 3000); // Clear progress after 3s
  };

  const deleteAsset = async (assetId: string, filePath: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await supabase.storage.from('client-assets').remove([filePath]);
      await supabase.from('assets').delete().eq('id', assetId);
      setAssets(assets.filter(a => a.id !== assetId));
    } catch (err: any) {
      alert("Error deleting asset: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center h-full min-h-screen">
        <Loader2 className="w-8 h-8 text-[#c6b198] animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return <div className="p-8 text-red-400">Error loading project: {error}</div>;
  }

  const client = project.clients;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <Link to="/admin/projects" className="inline-flex items-center space-x-2 text-white/50 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Projects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#131f24] border border-white/5 p-6 rounded-2xl">
            <h2 className="font-serif text-2xl text-white mb-6">Client Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Name</p>
                <p className="text-white text-base">{client.full_name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Email</p>
                <p className="text-white text-base">{client.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Client ID</p>
                {client.client_native_id ? (
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-[#c6b198]" />
                    <p className="text-[#c6b198] font-mono font-medium">{client.client_native_id}</p>
                  </div>
                ) : (
                  <p className="text-white/40 italic text-sm">Not generated yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#131f24] border border-white/5 p-6 rounded-2xl">
            <h2 className="font-serif text-2xl text-white mb-6">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Session Type</p>
                <p className="text-white text-base">{project.session_type}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Preferred Date</p>
                <p className="text-white text-base">{project.preferred_date || 'TBD'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Status</p>
                <select
                  value={project.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full bg-[#1c2e36] border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#c6b198]/50 transition-colors text-sm"
                >
                  <option value="Booked">Booked</option>
                  <option value="Waiting on Client">Waiting on Client</option>
                  <option value="Editing in Progress">Editing in Progress</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Payment Status</p>
                <p className={`text-sm font-medium ${project.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {project.payment_status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Notes</p>
                <p className="text-white/80 text-sm whitespace-pre-wrap">{project.internal_notes || 'None'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#131f24] border border-white/5 p-6 md:p-8 rounded-2xl min-h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl text-white">Deliverables</h2>
                <p className="text-white/50 text-sm mt-1">Upload client images here.</p>
              </div>

              {project.status !== 'Ready for Delivery' && project.status !== 'Completed' && (
                <button
                  onClick={markAsDone}
                  className="px-6 py-2 bg-[#c6b198] text-[#131f24] text-xs font-medium uppercase tracking-widest hover:bg-white transition-colors rounded shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Done</span>
                </button>
              )}
            </div>

            {/* Upload Zone */}
            <label className="border-2 border-dashed border-white/10 hover:border-[#c6b198]/50 bg-[#1c2e36]/50 rounded-xl p-8 mb-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
              <input type="file" multiple className="hidden" onChange={onFileUpload} accept="image/*" disabled={uploading} />
              <div className="w-16 h-16 bg-[#c6b198]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-[#c6b198]" />
              </div>
              <p className="text-white font-medium mb-1">Click or drag images to upload</p>
              <p className="text-white/40 text-sm">Supports JPG, PNG, WEBP</p>
            </label>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-3 mb-8">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="bg-[#1c2e36] p-3 rounded-lg flex items-center space-x-4 border border-white/5">
                    <FileImage className="w-5 h-5 text-white/40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{fileName}</p>
                      {progress === -1 ? (
                        <p className="text-xs text-red-400">Upload failed</p>
                      ) : (
                        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div className="bg-[#c6b198] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Asset Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-1 content-start">
              {assets.map((asset) => (
                <div key={asset.id} className="group relative aspect-square bg-[#1c2e36] rounded-xl overflow-hidden border border-white/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileImage className="w-8 h-8 text-white/20" />
                  </div>
                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => deleteAsset(asset.id, asset.file_path)}
                      className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/80 text-[10px] truncate">{asset.file_name}</p>
                  </div>
                </div>
              ))}
              {assets.length === 0 && !uploading && (
                <div className="col-span-full py-12 text-center text-white/40 flex flex-col items-center">
                  <FileImage className="w-12 h-12 mb-3 opacity-20" />
                  <p>No assets uploaded yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
