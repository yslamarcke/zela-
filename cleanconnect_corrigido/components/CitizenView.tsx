
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ShareButton } from './ShareButton';
import { analyzeReport } from '../services/geminiService';
import { Report, CitizenProfile, BroadcastMessage } from '../types';
import { Camera, MapPin, Loader2, Send, CheckCircle2, User, RefreshCcw, X, Image as ImageIcon, Megaphone } from 'lucide-react';

interface CitizenViewProps {
  onSubmitReport: (report: Omit<Report, 'id' | 'status' | 'timestamp'>) => void;
  reports: Report[];
  profile: CitizenProfile | null;
  onRegister: (profile: CitizenProfile) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  broadcasts: BroadcastMessage[];
}

export const CitizenView: React.FC<CitizenViewProps> = ({ onSubmitReport, reports, profile, onRegister, addToast, broadcasts }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Registration State
  const [regForm, setRegForm] = useState<CitizenProfile>({ name: '', phone: '', neighborhood: '', street: '' });

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter Broadcasts for Citizens
  const citizenBroadcasts = broadcasts.filter(b => b.target === 'citizens' || b.target === 'all');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.name && regForm.phone && regForm.neighborhood) {
      onRegister(regForm);
      addToast(`Bem-vindo, ${regForm.name}!`, 'success');
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      addToast("Erro ao acessar a câmera. Verifique as permissões.", "error");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) return;
    if (!profile) return;

    setIsAnalyzing(true);
    
    // Call Gemini API (Sending image if available could be added to analyzeReport in future)
    const analysis = await analyzeReport(description);
    
    onSubmitReport({
      description,
      location,
      category: analysis.category,
      priority: analysis.priority,
      aiAnalysis: analysis.summary,
      imageUrl: capturedImage || undefined,
      citizenName: profile.name,
      contactPhone: profile.phone
    });

    setIsAnalyzing(false);
    addToast("Solicitação enviada com sucesso!", "success");
    
    // Reset form
    setDescription('');
    setLocation('');
    setCapturedImage(null);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
       addToast("Obtendo localização...", "info");
       setTimeout(() => {
           setLocation(profile ? `${profile.street} (Local Atual)` : "Local Atual");
           addToast("Localização encontrada!", "success");
       }, 1000);
    } else {
       setLocation("Localização Indisponível");
    }
  };

  // --- RENDER REGISTRATION ---
  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-4 pt-10">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
          <div className="text-center mb-6">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Cadastro do Cidadão</h2>
            <p className="text-gray-500 text-sm">Precisamos de alguns dados para registrar suas denúncias.</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input 
                type="text" required 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
              <input 
                type="tel" required 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Bairro</label>
                <input 
                  type="text" required 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                  value={regForm.neighborhood} onChange={e => setRegForm({...regForm, neighborhood: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Rua</label>
                <input 
                  type="text" required 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                  value={regForm.street} onChange={e => setRegForm({...regForm, street: e.target.value})}
                />
              </div>
            </div>
            <Button type="submit" fullWidth className="mt-4">Cadastrar e Continuar</Button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN VIEW ---
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
         <div>
            <h2 className="text-xl font-bold">Olá, {profile.name}!</h2>
            <p className="text-emerald-50 opacity-90 text-sm">Ajude a cuidar do bairro {profile.neighborhood}.</p>
         </div>
         <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <User className="w-6 h-6 text-white" />
         </div>
      </div>

      {/* Official Broadcasts */}
      {citizenBroadcasts.length > 0 && (
         <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 animate-fade-in">
            <h3 className="font-bold text-sky-900 flex items-center mb-4">
               <Megaphone className="w-5 h-5 mr-2 text-sky-600" />
               Comunicados Oficiais
            </h3>
            <div className="space-y-3">
               {citizenBroadcasts.slice().reverse().map(bc => (
                  <div key={bc.id} className="bg-white p-4 rounded-xl shadow-sm border border-sky-100">
                     <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800">{bc.title}</h4>
                        <span className="text-xs text-gray-400">{bc.timestamp.toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-gray-600 mt-1">{bc.message}</p>
                     <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs font-medium text-sky-600">
                           {bc.senderName} • {bc.senderRole}
                        </div>
                        <ShareButton 
                           variant="ghost" 
                           title={bc.title} 
                           text={`${bc.title}: ${bc.message} - Via App ZelaPB`} 
                           label="Compartilhar"
                           onSuccess={() => addToast('Comunicado copiado!', 'info')}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Camera className="text-emerald-600" />
          Nova Solicitação
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Problema</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Lixo acumulado na calçada em frente à escola..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Endereço ou ponto de referência"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button 
                type="button"
                onClick={handleGetLocation}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Usar localização atual"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Camera UI */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Evidência (Foto)</label>
             {!showCamera && !capturedImage && (
                <button 
                  type="button"
                  onClick={startCamera}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-emerald-600 font-medium">Toque para abrir a câmera</span>
                </button>
             )}

             {showCamera && (
               <div className="relative bg-black rounded-lg overflow-hidden">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                   <button type="button" onClick={stopCamera} className="p-3 bg-red-500 rounded-full text-white">
                      <X className="w-6 h-6" />
                   </button>
                   <button type="button" onClick={capturePhoto} className="p-3 bg-white rounded-full text-emerald-600 border-4 border-emerald-600">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full"></div>
                   </button>
                 </div>
               </div>
             )}

             {capturedImage && (
               <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img src={capturedImage} alt="Captured" className="w-full h-64 object-cover" />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button type="button" onClick={() => setCapturedImage(null)} className="p-2 bg-white rounded-lg shadow text-red-500 text-sm font-medium flex items-center">
                       <RefreshCcw className="w-4 h-4 mr-1" /> Refazer
                    </button>
                  </div>
               </div>
             )}
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            disabled={isAnalyzing}
            className="mt-4"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Solicitação
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Minhas Solicitações Recentes</h3>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Nenhuma solicitação encontrada.</p>
          ) : (
            reports.slice().reverse().map(report => (
              <div key={report.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                 {report.imageUrl ? (
                   <img src={report.imageUrl} className="w-16 h-16 rounded-md object-cover bg-gray-200" alt="Evidência" />
                 ) : (
                   <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                     <ImageIcon className="w-6 h-6 text-gray-400" />
                   </div>
                 )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className="font-semibold text-gray-900">{report.aiAnalysis || report.category}</h4>
                     <ShareButton 
                        variant="icon" 
                        title={`Problema de ${report.category}`}
                        text={`Acabei de registrar uma denúncia no ZelaPB: ${report.description} em ${report.location}. Vamos cobrar solução!`}
                        onSuccess={() => addToast('Link para compartilhar copiado!', 'success')}
                        className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 -mt-2 -mr-2"
                     />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 pr-8">{report.description}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{report.timestamp.toLocaleDateString()}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium absolute bottom-4 right-4 
                  ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                    report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-200 text-gray-700'}`}>
                  {report.status === 'resolved' ? 'Resolvido' : 
                   report.status === 'in_progress' ? 'Andamento' : 'Pendente'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
