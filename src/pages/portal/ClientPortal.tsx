import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut, Download, Lock, CheckCircle2, FileImage } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export function ClientPortal() {
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = localStorage.getItem('portal_client_id');
    const nativeId = localStorage.getItem('portal_native_id');
    
    if (!clientId || !nativeId) {
      navigate('/portal');
      return;
    }

    fetchPortalData(clientId);
  }, [navigate]);

  const fetchPortalData = async (clientId: string) => {
    try {
      // Fetch Client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch Latest Project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch Assets (only if project is ready, but we will protect downloads anyway)
      const { data: assetData } = await supabase
        .from('assets')
        .select('*')
        .eq('project_id', projectData.id)
        .order('uploaded_at', { ascending: false });
      
      if (assetData) setAssets(assetData);

    } catch (err) {
      console.error(err);
      navigate('/portal');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_client_id');
    localStorage.removeItem('portal_native_id');
    navigate('/portal');
  };

  const handlePayment = async () => {
    // This will call our Vercel Serverless Function to create a Stripe checkout session
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate payment.");
      }
    } catch (err) {
      alert("Error connecting to payment provider.");
    }
  };

  const downloadAsset = async (asset: any) => {
    setDownloadingFile(asset.id);
    try {
      // 1. Get a short-lived signed URL
      const { data, error } = await supabase.storage
        .from('client-assets')
        .createSignedUrl(asset.file_path, 60); // 60 seconds
      
      if (error) throw error;
      
      // 2. Fetch the blob and trigger browser download
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert("Error downloading file: " + err.message);
    } finally {
      setDownloadingFile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c6b198] animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const isReady = project?.delivery_ready;
  const isPaid = project?.payment_status === 'paid';
  const showPaywall = isReady && !isPaid;

  return (
    <>
      <Navbar onBookClick={() => {}} />
      <div className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/5">
            <div>
              <p className="text-[#c6b198] text-sm uppercase tracking-widest mb-2">Welcome Back,</p>
              <h1 className="font-serif text-4xl md:text-5xl text-white">{client.full_name}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Status Alert */}
          {!isReady && (
            <div className="bg-[#1c2e36] border border-white/10 rounded-2xl p-8 md:p-12 text-center mb-12 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-6 h-6 text-[#c6b198] animate-spin" />
              </div>
              <h2 className="font-serif text-2xl text-white mb-2">Editing in Progress</h2>
              <p className="text-white/50 max-w-md mx-auto font-light">
                Your gallery is currently being curated and polished. We will notify you as soon as your photos are ready for delivery.
              </p>
            </div>
          )}

          {/* Paywall */}
          {showPaywall && (
            <div className="relative overflow-hidden bg-gradient-to-b from-[#1c2e36] to-[#131f24] border border-[#c6b198]/30 rounded-2xl p-8 md:p-16 text-center mb-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c6b198]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c6b198]/5 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#c6b198]/10 rounded-full flex items-center justify-center mb-8">
                  <Lock className="w-8 h-8 text-[#c6b198]" />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Your Gallery is Ready</h2>
                <p className="text-white/70 max-w-lg mx-auto font-light mb-10 text-lg">
                  Beautiful moments have been captured and perfected. Complete your payment to instantly unlock and download your full high-resolution gallery.
                </p>
                
                <button
                  onClick={handlePayment}
                  className="px-10 py-5 bg-[#c6b198] text-[#131f24] uppercase tracking-widest text-sm font-medium rounded-xl hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(198,177,152,0.3)]"
                >
                  Pay Now to Unlock
                </button>
              </div>
            </div>
          )}

          {/* Final Gallery Delivery */}
          {isReady && isPaid && (
            <div className="space-y-10">
              <div className="flex items-center space-x-3 text-green-400">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-medium tracking-wide">Gallery Unlocked</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {assets.map((asset) => (
                  <div key={asset.id} className="group relative aspect-square bg-[#1c2e36] rounded-xl overflow-hidden border border-white/5 transition-all hover:border-[#c6b198]/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileImage className="w-10 h-10 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    {/* Hover Download Action */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => downloadAsset(asset)}
                        disabled={downloadingFile === asset.id}
                        className="px-4 py-2 bg-[#c6b198] text-[#131f24] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 hover:bg-white transition-colors"
                      >
                        {downloadingFile === asset.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {assets.length === 0 && (
                  <div className="col-span-full py-20 text-center text-white/40">
                    No images available right now.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer onBookClick={() => {}} />
    </>
  );
}
