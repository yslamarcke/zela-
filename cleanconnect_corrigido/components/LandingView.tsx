
import React, { useState } from 'react';
import { AUTHOR, YEAR } from '../constants';
import { SystemConfig } from '../types';
import { Button } from './Button';
import { ShareButton } from './ShareButton';
import { CheckCircle, Users, Building, Mountain, Trees, Sprout, ShieldCheck, Download, X, Share as ShareIcon, MoreVertical, PlusSquare, Link as LinkIcon, Check } from 'lucide-react';

interface LandingViewProps {
  onEnterApp: (role: 'citizen' | 'team' | 'government' | 'admin') => void;
  config: SystemConfig;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, config }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
     navigator.clipboard.writeText(window.location.href);
     setCopiedLink(true);
     setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 font-sans">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative">
        
        {/* Top Actions */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
           <Button 
             variant="outline" 
             size="sm"
             onClick={() => setShowInstallModal(true)}
             className="bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-700 hidden sm:flex animate-pulse shadow-emerald-200 shadow-sm"
           >
             <Download className="w-4 h-4 mr-2" /> Baixar App
           </Button>
           <button 
             onClick={handleCopyLink}
             className="bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 p-2 rounded-lg hover:bg-white transition-colors hidden sm:flex items-center"
             title="Copiar Link"
           >
             {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
           </button>
           <ShareButton 
             variant="outline" 
             label="Espalhar"
             title={config.appName}
             text={`Estou usando o ${config.appName}: ${config.appSlogan}. Baixe agora e ajude a cuidar da nossa cidade!`}
             className="border-emerald-200 text-emerald-700 bg-white/80 backdrop-blur-sm hover:bg-white"
           />
        </div>

        {/* Logo Icon */}
        <div className="mb-6 p-6 bg-white rounded-full shadow-xl ring-8 ring-green-100 flex items-center justify-center relative overflow-hidden animate-bounce-slow">
          <Mountain className="w-20 h-20 text-emerald-700 relative z-10" />
          <Trees className="w-12 h-12 text-green-500 absolute bottom-4 right-4 opacity-80 z-20" />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          {config.appName}
        </h1>
        <p className="text-xl md:text-2xl text-emerald-800 max-w-2xl font-light italic mb-8">
          "{config.appSlogan}"
        </p>
        
        {/* Mobile Install Button (Visible only on small screens) */}
        <div className="sm:hidden mb-8 w-full max-w-xs flex gap-2">
           <Button 
             fullWidth 
             onClick={() => setShowInstallModal(true)}
             className="bg-gray-900 text-white shadow-lg hover:bg-gray-800 flex-1"
           >
             <Download className="w-5 h-5 mr-2" /> Instalar App
           </Button>
           <button 
             onClick={handleCopyLink}
             className="bg-white text-emerald-700 border border-emerald-200 rounded-lg px-3 shadow-sm hover:bg-gray-50 flex items-center justify-center"
           >
              {copiedLink ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
          {/* Card Cidadão */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-emerald-500 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('citizen')}>
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
               <Users className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Sou Cidadão</h3>
            <p className="text-sm text-gray-600">Viu algo errado na rua? Tire uma foto e mande pra gente.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">Acessar</Button>
          </div>
          
          {/* Card Equipe */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-amber-600 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('team')}>
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
               <CheckCircle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Sou da Equipe</h3>
            <p className="text-sm text-gray-600">Receba suas tarefas e cuide da nossa cidade.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full border-amber-200 text-amber-700 hover:bg-amber-50">Entrar</Button>
          </div>
          
          {/* Card Prefeitura */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-gray-600 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('government')}>
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
               <Building className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Prefeitura</h3>
            <p className="text-sm text-gray-600">Gestão completa e monitoramento em tempo real.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full hover:bg-gray-100 text-gray-800">Painel Gestor</Button>
          </div>
        </div>

        {/* Feature Highlights (Rural/Nature Theme) */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Mountain className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Do Interior à Capital</h4>
                 <p className="text-sm text-gray-600">Feito para atender a realidade das nossas serras e cidades.</p>
              </div>
           </div>
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Sprout className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Cidade Limpa e Verde</h4>
                 <p className="text-sm text-gray-600">Tecnologia ajudando a preservar nosso ambiente.</p>
              </div>
           </div>
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Users className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Comunidade Unida</h4>
                 <p className="text-sm text-gray-600">O povo colaborando com a gestão pública.</p>
              </div>
           </div>
        </div>
      </div>

      <footer className="py-6 text-center text-emerald-800/60 text-sm border-t border-emerald-100 bg-white/30 backdrop-blur-sm">
        <p>Criado por: {AUTHOR}</p>
        <p>Ano: {YEAR} • Paraíba, Brasil • Versão {config.version}</p>
        <button 
           onClick={() => onEnterApp('admin')}
           className="mt-4 text-xs font-semibold text-emerald-800/40 hover:text-amber-600 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
           <ShieldCheck className="w-3 h-3" /> Área do Desenvolvedor
        </button>
      </footer>

      {/* INSTALL APP MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-scale-in">
             <button 
               onClick={() => setShowInstallModal(false)} 
               className="absolute top-3 right-3 p-1 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
             
             <div className="text-center">
               <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner border border-emerald-200">
                  <Mountain className="w-10 h-10 text-emerald-600" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-1">Instalar {config.appName}</h3>
               <p className="text-emerald-600 font-medium text-xs mb-4 uppercase tracking-wide">Web App Oficial</p>
               
               <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                 Este aplicativo não ocupa memória e funciona direto do navegador! Adicione à sua tela inicial para acesso rápido.
               </p>
               
               <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-4 mb-6 border border-gray-100">
                  <div className="flex items-start gap-3">
                     <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 shrink-0">
                       <ShareIcon className="w-4 h-4 text-blue-500" />
                     </div>
                     <div>
                       <p className="font-bold text-gray-800 text-xs uppercase mb-1">iPhone (iOS)</p>
                       <span className="text-gray-600">Toque em <strong>Compartilhar</strong> e depois em <br/><span className="inline-flex items-center gap-1 font-semibold text-gray-800"><PlusSquare className="w-3 h-3" /> Adicionar à Tela de Início</span>.</span>
                     </div>
                  </div>
                  <div className="h-px bg-gray-200 w-full"></div>
                  <div className="flex items-start gap-3">
                     <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 shrink-0">
                       <MoreVertical className="w-4 h-4 text-gray-600" />
                     </div>
                     <div>
                       <p className="font-bold text-gray-800 text-xs uppercase mb-1">Android (Chrome)</p>
                       <span className="text-gray-600">Toque no <strong>Menu</strong> (3 pontos) e selecione <br/><span className="font-semibold text-gray-800">Instalar aplicativo</span> ou <span className="font-semibold text-gray-800">Adicionar à tela inicial</span>.</span>
                     </div>
                  </div>
               </div>
               
               <Button fullWidth onClick={() => setShowInstallModal(false)} className="bg-emerald-600 hover:bg-emerald-700">
                 Entendi, vou instalar!
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
