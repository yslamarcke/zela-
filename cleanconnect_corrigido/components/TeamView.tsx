
import React, { useState } from 'react';
import { Report, TeamUser, TeamInstruction, BroadcastMessage } from '../types';
import { Button } from './Button';
import { Map, CheckSquare, Clock, Shield, LogOut, Megaphone, Bell, UserCircle, Users, UserPlus, ClipboardList, ArrowRight, Lock, Briefcase, AlertTriangle } from 'lucide-react';

interface TeamViewProps {
  reports: Report[];
  onUpdateStatus: (id: string, status: Report['status']) => void;
  currentUser: TeamUser | null;
  allUsers: TeamUser[];
  onLogin: (user: TeamUser) => void;
  onLogout: () => void;
  instructions: TeamInstruction[];
  onAddInstruction: (msg: string) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  broadcasts: BroadcastMessage[];
}

export const TeamView: React.FC<TeamViewProps> = ({ 
  reports, 
  onUpdateStatus, 
  currentUser, 
  allUsers,
  onLogin, 
  onLogout,
  instructions,
  onAddInstruction,
  addToast,
  broadcasts
}) => {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Leader View State
  const [activeTab, setActiveTab] = useState<'tasks' | 'broadcast'>('tasks');
  const [newInstruction, setNewInstruction] = useState('');

  // Filter Broadcasts for Teams
  const teamBroadcasts = broadcasts.filter(b => b.target === 'teams' || b.target === 'all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = allUsers.find(u => u.username === username && (u.password === password || (!u.password && password === '1234')));
    if (user) {
      onLogin(user);
      setUsername('');
      setPassword('');
      addToast(`Bem-vindo, ${user.name}`, 'success');
    } else {
      addToast('Credenciais inválidas. Verifique usuário e senha.', 'error');
    }
  }

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  }

  const handlePostInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInstruction.trim()) {
      onAddInstruction(newInstruction);
      setNewInstruction('');
      addToast('Orientação enviada para a equipe!', 'success');
    }
  }

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-emerald-600">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
               <Shield className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acesso da Equipe</h2>
          <p className="text-center text-gray-500 mb-6">Área restrita para Líderes e Funcionários.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <UserCircle className="w-4 h-4" /> Usuário
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                placeholder="Ex: lider.limpeza"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock className="w-4 h-4" /> Senha
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mt-1"
                placeholder="****"
              />
            </div>
            <Button type="submit" fullWidth size="lg">Entrar no Sistema</Button>
          </form>

          {/* Quick Access Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">
              Acesso Rápido (Ambiente de Teste)
            </p>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => quickFill('lider.limpeza', '1234')}
                className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                   <div className="bg-indigo-200 p-1.5 rounded">
                      <Briefcase className="w-4 h-4 text-indigo-700" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-indigo-800">Líder de Limpeza</p>
                      <p className="text-xs text-indigo-500">Visão geral e gestão</p>
                   </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                type="button"
                onClick={() => quickFill('joao.silva', '1234')}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                   <div className="bg-emerald-200 p-1.5 rounded">
                      <UserCircle className="w-4 h-4 text-emerald-700" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-emerald-800">João (Membro)</p>
                      <p className="text-xs text-emerald-500">Acessar tarefas</p>
                   </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter data
  const myInstructions = instructions.filter(i => i.targetRole === currentUser.role || i.targetRole === 'all');
  const mySpecialtyReports = reports.filter(r => 
    r.status !== 'resolved' && 
    (r.category === currentUser.specialty || currentUser.specialty === 'Geral')
  );

  // --- LEADER DASHBOARD ---
  if (currentUser.role === 'leader') {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-700">
               <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Painel do Líder</h2>
              <p className="text-sm text-gray-500 font-medium">
                Gerenciando Equipe de {currentUser.specialty}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right">
               <p className="font-bold text-gray-800">{currentUser.name}</p>
               <p className="text-xs text-gray-400">ID: {currentUser.id}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'tasks' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}>
            Tarefas e Equipe
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'broadcast' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}>
            Comunicados
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Team Members */}
             <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-indigo-500"/>
                  Membros da Equipe ({allUsers.filter(u => u.specialty === currentUser.specialty && u.role !== 'leader').length})
                </h3>
                <div className="space-y-3">
                  {allUsers.filter(u => u.specialty === currentUser.specialty && u.role !== 'leader').map(user => (
                    <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativo</span>
                    </div>
                  ))}
                </div>
             </div>

             {/* Pending Reports */}
             <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2 text-indigo-500"/>
                  Relatórios Pendentes ({reports.filter(r => r.status !== 'resolved' && r.category === currentUser.specialty).length})
                </h3>
                {reports.filter(r => r.status !== 'resolved' && r.category === currentUser.specialty).length === 0 ? (
                  <p className="text-gray-400 text-center py-10">Nenhum relatório pendente para esta equipe.</p>
                ) : (
                  reports.filter(r => r.status !== 'resolved' && r.category === currentUser.specialty).map(report => (
                    <div key={report.id} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                      <div>
                         <p className="font-semibold text-gray-800 text-sm">{report.aiAnalysis || report.description}</p>
                         <div className="text-xs text-gray-500 mt-1">
                           {report.location} • {report.status === 'in_progress' ? 'Em andamento' : 'Pendente'}
                         </div>
                         <div className="mt-2 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs py-1 h-8"
                              onClick={() => {
                                 onUpdateStatus(report.id, 'resolved');
                                 addToast('Tarefa finalizada via painel do líder', 'success');
                              }}
                            >
                               Finalizar
                            </Button>
                         </div>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Create */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Nova Orientação</h3>
                <form onSubmit={handlePostInstruction}>
                  <textarea 
                    className="w-full p-4 rounded-lg border border-gray-300 text-sm mb-4 focus:ring-2 focus:ring-indigo-500 h-32"
                    placeholder={`Escreva uma mensagem para todos os membros de ${currentUser.specialty}...`}
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                  />
                  <Button type="submit" fullWidth variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
                    Enviar Comunicado
                  </Button>
                </form>
             </div>
             
             {/* History */}
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Histórico de Mensagens</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {myInstructions.length === 0 ? (
                    <p className="text-gray-400 text-sm">Nenhum comunicado enviado.</p>
                  ) : (
                    myInstructions.slice().reverse().map(inst => (
                      <div key={inst.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-gray-800 text-sm">{inst.message}</p>
                        <div className="text-right mt-2">
                           <span className="text-xs text-gray-400">{inst.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- MEMBER DASHBOARD ---
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
             <UserCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-sm text-gray-500 font-medium">
              Membro da Equipe • {currentUser.specialty}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Sidebar / Instructions */}
        <div className="space-y-6">
           {/* Notice Board */}
           <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <h3 className="font-bold text-amber-900 flex items-center mb-4">
                <Bell className="w-5 h-5 mr-2" />
                Quadro de Avisos
              </h3>
              
              <div className="space-y-4">
                 {/* Government Alerts */}
                 {teamBroadcasts.map(bc => (
                    <div key={bc.id} className={`p-3 rounded-lg shadow-sm border-l-4 ${bc.priority === 'Urgent' ? 'bg-red-50 border-red-500' : 'bg-white border-indigo-500'}`}>
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold uppercase ${bc.priority === 'Urgent' ? 'text-red-700' : 'text-indigo-700'}`}>
                             {bc.senderName}
                          </span>
                       </div>
                       <p className="text-gray-800 text-sm font-medium">{bc.title}</p>
                       <p className="text-gray-600 text-xs mt-1">{bc.message}</p>
                    </div>
                 ))}

                 {/* Leader Instructions */}
                 {myInstructions.length === 0 && teamBroadcasts.length === 0 ? (
                    <p className="text-amber-700/50 text-sm italic">Nenhum aviso no momento.</p>
                 ) : (
                    myInstructions.slice().reverse().map(inst => (
                      <div key={inst.id} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                        <p className="text-gray-800 text-sm mb-2">{inst.message}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="font-medium">{inst.leaderName}</span>
                          <span>{inst.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Tasks */}
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-gray-800">
               Tarefas de {currentUser.specialty}
             </h3>
             <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
               {mySpecialtyReports.length} pendentes
             </span>
           </div>

           {/* Map Placeholder */}
           <div className="bg-slate-200 rounded-2xl h-48 w-full flex items-center justify-center relative overflow-hidden shadow-inner mb-6">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://picsum.photos/800/600?grayscale')" }}></div>
              <div className="relative z-10 text-slate-600 flex flex-col items-center bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                <Map className="w-8 h-8 mb-2 text-emerald-600" />
                <span className="font-bold text-sm">Rota Otimizada para {currentUser.specialty}</span>
              </div>
           </div>

           <div className="space-y-4">
             {mySpecialtyReports.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                 <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                 <p className="text-gray-500">Tudo limpo! Nenhuma tarefa pendente.</p>
               </div>
             ) : (
               mySpecialtyReports.map(report => (
                 <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md flex flex-col md:flex-row gap-4">
                   {/* Image Thumbnail */}
                   <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt="Problema" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sem foto</div>
                      )}
                   </div>

                   <div className="flex-1">
                     <div className="flex justify-between items-start mb-2">
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide 
                         ${report.priority === 'High' ? 'bg-red-100 text-red-700' : 
                           report.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                           'bg-blue-100 text-blue-700'}`}>
                         Prioridade {report.priority === 'High' ? 'Alta' : report.priority === 'Medium' ? 'Média' : 'Baixa'}
                       </span>
                       <span className="text-xs text-gray-400 flex items-center">
                         <Clock className="w-3 h-3 mr-1" />
                         {report.timestamp.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                       </span>
                     </div>
                     
                     <h3 className="font-bold text-lg text-gray-800 mb-1">{report.aiAnalysis || report.category}</h3>
                     <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                     
                     <div className="text-sm text-gray-500 mb-2">
                        <strong>Local:</strong> {report.location}
                     </div>
                     {report.citizenName && (
                       <div className="text-xs text-gray-400 mb-4">
                          Solicitado por: {report.citizenName} {report.contactPhone && `(${report.contactPhone})`}
                       </div>
                     )}

                     <div className="flex gap-2 mt-auto">
                       {report.status === 'pending' && (
                         <Button 
                           variant="secondary" 
                           size="sm" 
                           className="flex-1"
                           onClick={() => {
                             onUpdateStatus(report.id, 'in_progress');
                             addToast('Tarefa iniciada', 'info');
                           }}
                         >
                           Iniciar
                         </Button>
                       )}
                       <Button 
                         variant="primary" 
                         size="sm" 
                         className="flex-1"
                         onClick={() => {
                           onUpdateStatus(report.id, 'resolved');
                           addToast('Tarefa concluída com sucesso!', 'success');
                         }}
                       >
                         Concluir
                       </Button>
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
