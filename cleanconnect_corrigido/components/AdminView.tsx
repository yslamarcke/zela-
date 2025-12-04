
import React, { useState, useMemo, useEffect } from 'react';
import { AdminUser, Municipality, SystemConfig } from '../types';
import { MOCK_ADMIN } from '../constants';
import { Button } from './Button';
import { generateSystemUpdate } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldCheck, Wallet, Users, Activity, Lock, Unlock, DollarSign, Building, AlertCircle, Settings, FileText, Download, Calendar, Home, ArrowLeft, Terminal, Save, RefreshCw, Power, Bot, Sparkles, Command, Share2, Smartphone, Globe, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { ShareButton } from './ShareButton';

interface AdminViewProps {
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  municipalities: Municipality[];
  onUpdateMunicipalityStatus: (id: string, status: Municipality['status']) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  systemConfig: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  currentUser, 
  onLogin, 
  onLogout,
  municipalities,
  onUpdateMunicipalityStatus,
  addToast,
  systemConfig,
  onUpdateConfig
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'clients' | 'contracts' | 'system' | 'deploy'>('overview');

  // Config Form State
  const [configForm, setConfigForm] = useState<SystemConfig>(systemConfig);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  
  // Link Gen State
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  // AI Command State
  const [aiCommand, setAiCommand] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    setConfigForm(systemConfig);
  }, [systemConfig]);

  // Stats Calculation
  const stats = useMemo(() => {
    const totalClients = municipalities.length;
    const activeClients = municipalities.filter(m => m.status === 'active').length;
    const blockedClients = municipalities.filter(m => m.status === 'blocked').length;
    
    const totalMonthlyRevenue = activeClients * 5000;
    const totalBalance = totalMonthlyRevenue * 1.5; // Simulating some accumulated balance

    const revenueData = [
      { name: 'Jan', value: 15000 },
      { name: 'Fev', value: 20000 },
      { name: 'Mar', value: 25000 },
      { name: 'Abr', value: 25000 }, // One blocked
      { name: 'Mai', value: totalMonthlyRevenue },
    ];

    return { totalClients, activeClients, blockedClients, totalMonthlyRevenue, totalBalance, revenueData };
  }, [municipalities]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === MOCK_ADMIN.username && password === 'admin123') { // Simple hardcoded pass for prototype
      onLogin(MOCK_ADMIN);
      addToast(`Bem-vindo, Criador ${MOCK_ADMIN.name}`, 'success');
    } else {
      addToast('Acesso negado. Credenciais incorretas.', 'error');
    }
  };

  const quickFill = () => {
    setUsername(MOCK_ADMIN.username);
    setPassword('admin123');
  };

  const handleWithdraw = () => {
    addToast('Solicitação de saque enviada para processamento bancário.', 'success');
  };

  const calculateContractProgress = (start: Date, end: Date) => {
    const total = end.getTime() - start.getTime();
    const current = new Date().getTime() - start.getTime();
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    return percentage;
  };

  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    // Simulate generation delay
    setTimeout(() => {
      setGeneratedLink(window.location.href);
      setIsGeneratingLink(false);
      addToast("Link oficial gerado com sucesso!", "success");
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Link copiado para a área de transferência!", "success");
  };

  // --- AI COMMAND EXECUTION ---
  const handleExecuteAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;

    setIsAiProcessing(true);
    setDeployLogs(prev => [...prev, `> USER: "${aiCommand}"`]);
    setDeployLogs(prev => [...prev, '> AI: Analisando intenção do criador...']);

    try {
      const newConfig = await generateSystemUpdate(aiCommand, configForm);
      setConfigForm(newConfig);
      
      setDeployLogs(prev => [...prev, '> AI: Configuração gerada com sucesso.']);
      setDeployLogs(prev => [...prev, '> AI: Atualizando campos do formulário...']);
      setDeployLogs(prev => [...prev, '> SYSTEM: Aguardando confirmação manual (Clique em Salvar).']);
      
      addToast('IA atualizou o formulário. Revise e Salve.', 'success');
      setAiCommand('');
    } catch (err) {
      setDeployLogs(prev => [...prev, '> ERROR: Falha na interpretação da IA.']);
      addToast('Erro ao processar comando de IA.', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // --- DEPLOY SIMULATION ---
  const handleDeployUpdate = () => {
    setIsDeploying(true);
    setDeployLogs(p => [...p, 'Iniciando processo de build...']);
    
    // Simulation sequence
    setTimeout(() => setDeployLogs(p => [...p, 'Compilando módulos React...']), 800);
    setTimeout(() => setDeployLogs(p => [...p, 'Otimizando assets e imagens...']), 1600);
    setTimeout(() => setDeployLogs(p => [...p, 'Atualizando banco de dados...']), 2400);
    setTimeout(() => setDeployLogs(p => [...p, 'Aplicando novas configurações...']), 3000);
    
    setTimeout(() => {
      onUpdateConfig(configForm);
      setIsDeploying(false);
      setDeployLogs([]);
      addToast('Sistema atualizado com sucesso! Nova versão no ar.', 'success');
    }, 3800);
  };

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-900 text-white px-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-yellow-300"></div>
          <div className="flex justify-center mb-6 mt-4">
            <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
               <ShieldCheck className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Área do Criador</h2>
          <p className="text-center text-slate-400 mb-8 font-light">Controle Total do Sistema ZelaPB</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-400">ID de Super Admin</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white mt-1 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Chave Mestra</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white mt-1 transition-all"
              />
            </div>
            <Button type="submit" fullWidth className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 shadow-lg transform hover:scale-[1.02] transition-all">
               Entrar no Painel
            </Button>
          </form>

          <button onClick={quickFill} className="mt-6 text-xs text-slate-500 w-full text-center hover:text-amber-400 transition-colors">
             (Preenchimento Automático de Teste)
          </button>
          
          <div className="mt-8 pt-6 border-t border-slate-700 flex justify-center">
            <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar - Premium Look */}
      <div className="bg-slate-900 text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-1.5 rounded-lg text-slate-900">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide text-amber-50">PAINEL DO CRIADOR</h1>
                <p className="text-[10px] text-amber-500/80 uppercase tracking-widest font-semibold">Modo Super Admin</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                 <p className="text-xs text-slate-400">Usuário Logado</p>
                 <p className="text-sm font-bold text-white">{currentUser.name}</p>
              </div>
              <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="border-slate-600 text-slate-300 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 transition-all"
              >
                 <Home className="w-4 h-4 mr-2" /> Voltar ao Início
              </Button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receita Mensal</p>
                 <Activity className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800">
                 {stats.totalMonthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-xs text-emerald-600 mt-1 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded-full">+10% vs mês anterior</p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prefeituras</p>
                 <Building className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.activeClients} <span className="text-lg text-slate-400 font-normal">/ {stats.totalClients}</span></p>
              <p className="text-xs text-slate-500 mt-1">1 Inadimplente</p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Total</p>
                 <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800">
                 {stats.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <button className="text-xs text-amber-600 hover:text-amber-700 mt-1 font-medium underline decoration-amber-600/30">
                 Ver extrato bancário
              </button>
           </div>

           <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Settings className="w-24 h-24 text-white" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status do Sistema</p>
                 {systemConfig.maintenanceMode ? (
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                 ) : (
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 )}
              </div>
              <p className="text-lg font-bold mb-1">{systemConfig.appName} Cloud v{systemConfig.version}</p>
              <p className="text-xs text-slate-400 mb-3">
                 {systemConfig.maintenanceMode ? "EM MANUTENÇÃO" : "Todos os serviços operacionais"}
              </p>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className={`h-full w-[98%] ${systemConfig.maintenanceMode ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              </div>
           </div>
        </div>

        {/* Tabs & Content */}
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">Navegação Principal</p>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'overview' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                 <Activity className="w-5 h-5" /> Visão Geral
              </button>
              <button 
                onClick={() => setActiveTab('financial')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'financial' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                 <DollarSign className="w-5 h-5" /> Financeiro
              </button>
              <button 
                onClick={() => setActiveTab('clients')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'clients' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                 <Users className="w-5 h-5" /> Prefeituras
              </button>
              <div className="h-px bg-slate-200 my-2 mx-4"></div>
              <button 
                onClick={() => setActiveTab('contracts')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'contracts' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                 <FileText className="w-5 h-5" /> Dados e Contratos
              </button>
              <button 
                onClick={() => setActiveTab('system')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'system' ? 'bg-slate-800 text-white shadow-md translate-x-1' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
              >
                 <Bot className="w-5 h-5" /> Sistema & IA
              </button>
              <button 
                onClick={() => setActiveTab('deploy')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3
                ${activeTab === 'deploy' ? 'bg-emerald-600 text-white shadow-md translate-x-1' : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-transparent'}`}
              >
                 <Globe className="w-5 h-5" /> Publicação (Go Live)
              </button>
           </div>

           <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[600px]">
              {activeTab === 'overview' && (
                 <div className="animate-fade-in">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Dashboard de Crescimento</h3>
                    <p className="text-slate-500 mb-8">Acompanhamento de métricas chave do negócio.</p>
                    
                    <div className="h-[350px] w-full mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.revenueData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                             <YAxis tickFormatter={(val) => `R$${val/1000}k`} axisLine={false} tickLine={false} />
                             <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                             />
                             <Line type="monotone" dataKey="value" stroke="#d97706" strokeWidth={4} activeDot={{ r: 8, fill: '#d97706' }} dot={{ fill: '#d97706', r: 4 }} />
                          </LineChart>
                       </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <AlertCircle className="w-5 h-5 text-amber-500" />
                             Alertas Recentes
                          </h4>
                          <ul className="space-y-3">
                             <li className="flex items-start gap-3 text-sm p-3 bg-red-50 text-red-700 rounded-lg">
                                <span className="w-2 h-2 mt-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                Falha no pagamento: Prefeitura de Patos (Tentativa 2/3).
                             </li>
                             <li className="flex items-start gap-3 text-sm p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                                <span className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                Nova prefeitura interessada: Cabedelo (Contato via site).
                             </li>
                          </ul>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'financial' && (
                 <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                       <div>
                          <h3 className="text-2xl font-bold text-slate-800">Controle Financeiro</h3>
                          <p className="text-slate-500">Gestão de entradas e saídas.</p>
                       </div>
                       <Button onClick={handleWithdraw} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                          <DollarSign className="w-4 h-4 mr-2" /> Solicitar Transferência
                       </Button>
                    </div>

                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                       <div className="absolute right-0 bottom-0 opacity-10">
                          <Wallet className="w-48 h-48" />
                       </div>
                       <p className="text-sm font-medium text-slate-400 mb-2">Saldo Consolidado (Líquido)</p>
                       <p className="text-5xl font-bold text-white mb-6 tracking-tight">
                          {stats.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                       </p>
                       <div className="flex gap-4">
                          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                             <p className="text-[10px] text-slate-300 uppercase">Próximo Recebimento</p>
                             <p className="font-bold text-emerald-400">10/06/2025</p>
                          </div>
                          <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                             <p className="text-[10px] text-slate-300 uppercase">Dados Bancários</p>
                             <p className="font-bold text-white">Banco do Brasil</p>
                          </div>
                       </div>
                    </div>

                    <h4 className="font-bold text-slate-800 mb-4 text-lg">Movimentações do Mês</h4>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                             <tr>
                                <th className="py-4 px-6">Data</th>
                                <th className="py-4 px-6">Tipo / Descrição</th>
                                <th className="py-4 px-6">Origem</th>
                                <th className="py-4 px-6 text-right">Valor</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-700">15/05/2025</td>
                                <td className="py-4 px-6"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold mr-2">ENTRADA</span> Mensalidade</td>
                                <td className="py-4 px-6">Campina Grande</td>
                                <td className="py-4 px-6 text-right font-bold text-emerald-600">+ R$ 5.000,00</td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-700">10/05/2025</td>
                                <td className="py-4 px-6"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold mr-2">ENTRADA</span> Mensalidade</td>
                                <td className="py-4 px-6">João Pessoa</td>
                                <td className="py-4 px-6 text-right font-bold text-emerald-600">+ R$ 5.000,00</td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-700">01/05/2025</td>
                                <td className="py-4 px-6"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold mr-2">SAÍDA</span> Infraestrutura</td>
                                <td className="py-4 px-6">AWS Cloud Services</td>
                                <td className="py-4 px-6 text-right font-bold text-red-500">- R$ 350,00</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {activeTab === 'clients' && (
                 <div className="animate-fade-in">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Base de Clientes</h3>
                    <div className="grid grid-cols-1 gap-4">
                       {municipalities.map(city => (
                          <div key={city.id} className="group bg-white p-5 border border-slate-200 rounded-xl hover:shadow-lg hover:border-amber-200 transition-all">
                             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-5 w-full md:w-auto">
                                   <div className={`p-4 rounded-full ${city.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                      <Building className="w-6 h-6" />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-2">
                                         <h4 className="font-bold text-xl text-slate-800">{city.name}</h4>
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            city.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                         }`}>
                                            {city.status === 'active' ? 'Regular' : 'Inadimplente'}
                                         </span>
                                      </div>
                                      <p className="text-sm text-slate-500 mt-1">Gestor: <strong>{city.mayorName}</strong></p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                         <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Cliente desde {city.joinedDate.toLocaleDateString()}</span>
                                         <span>•</span>
                                         <span>Plano Pro (R$ 5k)</span>
                                      </div>
                                   </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                   {city.status === 'active' ? (
                                      <Button 
                                         variant="danger" 
                                         size="sm"
                                         className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-none w-full md:w-auto"
                                         onClick={() => {
                                            onUpdateMunicipalityStatus(city.id, 'blocked');
                                            addToast(`Acesso de ${city.name} bloqueado.`, 'info');
                                         }}
                                      >
                                         <Lock className="w-4 h-4 mr-2" /> Bloquear Acesso
                                      </Button>
                                   ) : (
                                      <Button 
                                         variant="primary" 
                                         size="sm" 
                                         className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto"
                                         onClick={() => {
                                            onUpdateMunicipalityStatus(city.id, 'active');
                                            addToast(`Acesso de ${city.name} liberado.`, 'success');
                                         }}
                                      >
                                         <Unlock className="w-4 h-4 mr-2" /> Liberar Sistema
                                      </Button>
                                   )}
                                   <Button variant="outline" size="sm" className="w-full md:w-auto">
                                      <Settings className="w-4 h-4" />
                                   </Button>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'contracts' && (
                 <div className="animate-fade-in">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Dados e Contratos</h3>
                    <p className="text-slate-500 mb-8">Gestão documental e vigência dos serviços.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {municipalities.map(city => {
                          const progress = calculateContractProgress(city.joinedDate, city.nextPaymentDate); // Using next payment as a proxy for contract cycle or end date simulation
                          // Simulating a contract end date 1 year from join
                          const contractEnd = new Date(city.joinedDate);
                          contractEnd.setFullYear(contractEnd.getFullYear() + 1);
                          const contractProgress = calculateContractProgress(city.joinedDate, contractEnd);

                          return (
                             <div key={city.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                   <div className="flex items-center gap-3">
                                      <div className="bg-slate-100 p-2 rounded-lg">
                                         <FileText className="w-6 h-6 text-slate-600" />
                                      </div>
                                      <div>
                                         <h4 className="font-bold text-lg text-slate-800">{city.name}</h4>
                                         <p className="text-xs text-slate-500">CONTRATO #{city.id.toUpperCase()}2025</p>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-sm font-bold text-slate-800">R$ 5.000,00</p>
                                      <p className="text-[10px] text-slate-400">/ MÊS</p>
                                   </div>
                                </div>

                                <div className="mb-6 relative z-10">
                                   <div className="flex justify-between text-xs text-slate-500 mb-1">
                                      <span>Vigência: {Math.round(contractProgress)}%</span>
                                      <span>Renovação: {contractEnd.toLocaleDateString()}</span>
                                   </div>
                                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div 
                                         className={`h-full rounded-full ${contractProgress > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                         style={{ width: `${contractProgress}%` }}
                                      ></div>
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6 relative z-10">
                                   <div>
                                      <p className="text-[10px] uppercase text-slate-400 font-bold">Início</p>
                                      <p>{city.joinedDate.toLocaleDateString()}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] uppercase text-slate-400 font-bold">Próx. Fatura</p>
                                      <p>{city.nextPaymentDate.toLocaleDateString()}</p>
                                   </div>
                                </div>

                                <div className="flex gap-3 relative z-10">
                                   <Button variant="outline" size="sm" className="flex-1 border-slate-300 hover:bg-slate-50 text-slate-700">
                                      <Download className="w-4 h-4 mr-2" /> Baixar PDF
                                   </Button>
                                   <Button variant="primary" size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 border-none text-white">
                                      Renovar
                                   </Button>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              )}

              {activeTab === 'system' && (
                <div className="animate-fade-in flex flex-col h-full">
                   <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">Sistema & AI DevOps</h3>
                        <p className="text-slate-500">Controle o sistema via comandos de voz/texto ou manual.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${isDeploying ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${isDeploying ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        <span className="text-xs font-mono text-slate-500 uppercase">{isDeploying ? 'Deploying...' : 'Online'}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                      {/* Controls Form */}
                      <div className="space-y-6">
                         
                         {/* AI Command Center */}
                         <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-5 rounded-xl border border-indigo-500/50 shadow-lg relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-3 opacity-20">
                             <Sparkles className="w-20 h-20 text-indigo-400" />
                           </div>
                           <h4 className="font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                              <Bot className="w-5 h-5 text-indigo-400" /> AI System Copilot
                           </h4>
                           <p className="text-xs text-indigo-200 mb-4 relative z-10">Digite comandos para alterar a configuração (Ex: "Ativar modo manutenção e mudar slogan").</p>
                           
                           <form onSubmit={handleExecuteAiCommand} className="flex gap-2 relative z-10">
                              <div className="relative flex-1">
                                <Command className="absolute top-3 left-3 w-4 h-4 text-indigo-400" />
                                <input 
                                  type="text" 
                                  value={aiCommand}
                                  onChange={(e) => setAiCommand(e.target.value)}
                                  placeholder="Digite um comando..." 
                                  className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-indigo-500/30 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                  disabled={isAiProcessing || isDeploying}
                                />
                              </div>
                              <button 
                                type="submit"
                                disabled={isAiProcessing || isDeploying || !aiCommand}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isAiProcessing ? '...' : 'Executar'}
                              </button>
                           </form>
                         </div>

                         {/* Manual Controls */}
                         <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <Settings className="w-5 h-5 text-slate-500" /> Configurações Gerais
                            </h4>
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Aplicativo</label>
                                  <input 
                                    type="text" 
                                    value={configForm.appName}
                                    onChange={e => setConfigForm({...configForm, appName: e.target.value})}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500" 
                                  />
                               </div>
                               <div>
                                  <label className="block text-sm font-medium text-slate-600 mb-1">Slogan</label>
                                  <input 
                                    type="text" 
                                    value={configForm.appSlogan}
                                    onChange={e => setConfigForm({...configForm, appSlogan: e.target.value})}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500" 
                                  />
                               </div>
                               <div>
                                  <label className="block text-sm font-medium text-slate-600 mb-1">Versão do Build</label>
                                  <input 
                                    type="text" 
                                    value={configForm.version}
                                    onChange={e => setConfigForm({...configForm, version: e.target.value})}
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 font-mono text-sm" 
                                  />
                               </div>
                            </div>
                         </div>

                         <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <Power className="w-5 h-5 text-slate-500" /> Controle de Estado
                            </h4>
                            <div className="space-y-4">
                               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                  <div>
                                     <p className="font-medium text-slate-800">Modo Manutenção</p>
                                     <p className="text-xs text-slate-500">Bloqueia acesso público ao app</p>
                                  </div>
                                  <button 
                                    onClick={() => setConfigForm({...configForm, maintenanceMode: !configForm.maintenanceMode})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${configForm.maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                                  >
                                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${configForm.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                  </button>
                               </div>
                               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                  <div>
                                     <p className="font-medium text-slate-800">Novos Registros</p>
                                     <p className="text-xs text-slate-500">Permitir cadastro de cidadãos</p>
                                  </div>
                                  <button 
                                    onClick={() => setConfigForm({...configForm, allowRegistrations: !configForm.allowRegistrations})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${configForm.allowRegistrations ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                  >
                                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${configForm.allowRegistrations ? 'translate-x-6' : 'translate-x-1'}`} />
                                  </button>
                               </div>
                            </div>
                         </div>

                         <Button 
                           onClick={handleDeployUpdate} 
                           disabled={isDeploying || isAiProcessing}
                           fullWidth 
                           className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                         >
                            {isDeploying ? (
                               <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Deploying...</>
                            ) : (
                               <><Save className="w-4 h-4 mr-2" /> Salvar e Atualizar App</>
                            )}
                         </Button>
                      </div>

                      {/* Fake Terminal */}
                      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-sm h-full max-h-[600px]">
                         <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2"><Terminal className="w-4 h-4" /> zela-cli — deploy</span>
                            <div className="flex gap-1.5">
                               <div className="w-3 h-3 rounded-full bg-red-500"></div>
                               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                               <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                         </div>
                         <div className="p-4 text-emerald-400 flex-1 overflow-y-auto space-y-2">
                            <p className="text-slate-500">$ status check</p>
                            <p>System operational. Build v{systemConfig.version}</p>
                            <p className="text-slate-500">$ waiting for updates...</p>
                            {deployLogs.map((log, idx) => (
                               <p key={idx} className={`animate-slide-in ${log.startsWith('> USER') ? 'text-indigo-300' : log.startsWith('> AI') ? 'text-amber-400' : ''}`}>{log}</p>
                            ))}
                            {isDeploying && <span className="animate-pulse">_</span>}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'deploy' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Publicação e Compartilhamento</h3>
                  
                  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center mb-8 shadow-sm">
                     <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-10 h-10 text-emerald-600" />
                     </div>
                     <h2 className="text-xl font-bold text-slate-800">Seu App está Online!</h2>
                     <p className="text-slate-500 mb-6">Utilize o link abaixo para compartilhar com prefeituras e cidadãos.</p>
                     
                     {!generatedLink ? (
                        <Button 
                           onClick={handleGenerateLink} 
                           className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg mx-auto"
                           disabled={isGeneratingLink}
                        >
                           {isGeneratingLink ? (
                              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gerando Link Seguro...</>
                           ) : (
                              <><LinkIcon className="w-4 h-4 mr-2" /> Gerar Link Oficial de Download</>
                           )}
                        </Button>
                     ) : (
                        <div className="flex justify-center max-w-xl mx-auto mb-6 animate-scale-in">
                           <div className="flex-1 bg-slate-100 p-3 rounded-l-lg border border-emerald-300 font-mono text-sm overflow-hidden whitespace-nowrap text-ellipsis text-emerald-800 bg-emerald-50">
                              {generatedLink}
                           </div>
                           <button 
                              onClick={() => copyToClipboard(generatedLink)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-r-lg font-bold flex items-center transition-colors"
                           >
                              <Copy className="w-4 h-4 mr-2" /> Copiar
                           </button>
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <Smartphone className="w-5 h-5" /> Instalação (PWA)
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                           Para oferecer uma experiência de aplicativo nativo, instrua seus usuários a:
                        </p>
                        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 ml-2">
                           <li>Abrir este link no <strong>Chrome</strong> (Android) ou <strong>Safari</strong> (iOS).</li>
                           <li>Tocar no botão de menu do navegador.</li>
                           <li>Selecionar <strong>"Adicionar à Tela Inicial"</strong>.</li>
                        </ol>
                     </div>

                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <Globe className="w-5 h-5" /> Hospedagem Profissional
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                           Para mover este protótipo para um domínio próprio (ex: <strong>www.zelapb.com.br</strong>):
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 ml-2">
                           <li>Exporte o código fonte.</li>
                           <li>Crie uma conta na <strong>Vercel</strong> ou <strong>Netlify</strong>.</li>
                           <li>Conecte seu repositório GitHub.</li>
                           <li>O deploy será automático e gratuito.</li>
                        </ul>
                     </div>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
