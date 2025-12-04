import React, { useState, useMemo } from 'react';
import { Report, GovernmentUser, BroadcastMessage, TeamUser, TeamSpecialty } from '../types';
import { MOCK_GOV_USERS } from '../constants';
import { Button } from './Button';
import { ShareButton } from './ShareButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, AlertCircle, Building, Lock, LogOut, Radio, Send, Users, Megaphone, AlertTriangle, ArrowRight, Banknote, UserPlus, Trash2, Briefcase } from 'lucide-react';

interface CityHallViewProps {
  reports: Report[];
  currentUser: GovernmentUser | null;
  onLogin: (user: GovernmentUser) => void;
  onLogout: () => void;
  broadcasts: BroadcastMessage[];
  onAddBroadcast: (title: string, message: string, target: 'citizens' | 'teams' | 'all', priority: 'Normal' | 'Urgent') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  allTeamUsers: TeamUser[];
  onRegisterMember: (user: TeamUser) => void;
  onRemoveMember: (id: string) => void;
}

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626'];

export const CityHallView: React.FC<CityHallViewProps> = ({ 
  reports, 
  currentUser, 
  onLogin, 
  onLogout, 
  broadcasts,
  onAddBroadcast,
  addToast,
  allTeamUsers,
  onRegisterMember,
  onRemoveMember
}) => {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'comms' | 'team_mgmt'>('dashboard');
  
  // Broadcast Form State
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcTarget, setBcTarget] = useState<'citizens' | 'teams' | 'all'>('citizens');
  const [bcPriority, setBcPriority] = useState<'Normal' | 'Urgent'>('Normal');

  // Team Mgmt Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUser, setNewMemberUser] = useState('');
  const [newMemberPass, setNewMemberPass] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'leader' | 'member'>('member');
  const [newMemberSpecialty, setNewMemberSpecialty] = useState<TeamSpecialty>('Limpeza Urbana');

  // Compute Stats
  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const efficiency = total ? Math.round((resolved / total) * 100) : 0;
    
    // Group by category for charts
    const categoryDataMap: Record<string, number> = {};
    reports.forEach(r => {
      const cat = r.category || 'Outros';
      categoryDataMap[cat] = (categoryDataMap[cat] || 0) + 1;
    });
    
    const categoryData = Object.keys(categoryDataMap).map(key => ({
      name: key,
      value: categoryDataMap[key]
    }));

    // Status data
    const statusData = [
      { name: 'Resolvido', value: resolved },
      { name: 'Em Andamento', value: reports.filter(r => r.status === 'in_progress').length },
      { name: 'Pendente', value: pending },
    ].filter(d => d.value > 0);

    const criticalReports = reports.filter(r => r.priority === 'High' && r.status !== 'resolved');

    return { total, resolved, pending, efficiency, categoryData, statusData, criticalReports };
  }, [reports]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_GOV_USERS.find(u => u.username === username && (u.password === password || (!u.password && password === '1234')));
    if (user) {
      onLogin(user);
      addToast(`Bem-vindo, ${user.name}`, 'success');
    } else {
      addToast('Credenciais inválidas.', 'error');
    }
  };

  const quickFill = (u: string) => {
    setUsername(u);
    setPassword('1234');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (bcTitle && bcMessage) {
      onAddBroadcast(bcTitle, bcMessage, bcTarget, bcPriority);
      setBcTitle('');
      setBcMessage('');
      addToast('Comunicado enviado com sucesso!', 'success');
    }
  };

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: TeamUser = {
      id: Date.now().toString(),
      name: newMemberName,
      username: newMemberUser,
      password: newMemberPass,
      role: newMemberRole,
      specialty: newMemberSpecialty
    };

    onRegisterMember(newUser);
    setNewMemberName('');
    setNewMemberUser('');
    setNewMemberPass('');
    addToast(`${newMemberRole === 'leader' ? 'Líder' : 'Funcionário'} cadastrado com sucesso!`, 'success');
  };

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-gray-800">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full">
               <Building className="w-8 h-8 text-gray-800" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Portal da Prefeitura</h2>
          <p className="text-center text-gray-500 mb-6">Acesso Administrativo Governamental.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="w-4 h-4" /> Usuário
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 mt-1"
                placeholder="Ex: prefeito"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 mt-1"
                placeholder="****"
              />
            </div>
            <Button type="submit" fullWidth size="lg" className="bg-gray-800 hover:bg-gray-900 text-white">Entrar</Button>
          </form>

          {/* Quick Access */}
          <div className="mt-8 pt-6 border-t border-gray-100">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">
              Acesso Rápido (Demo)
            </p>
            <div className="space-y-2">
               <button onClick={() => quickFill('prefeito')} className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors group">
                  <span className="text-sm font-bold text-gray-900">Entrar como Prefeito</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
               </button>
               <button onClick={() => quickFill('secretaria')} className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors group">
                  <span className="text-sm font-bold text-gray-900">Entrar como Secretária</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
          <div className="p-6 bg-gray-800 text-white">
            <h2 className="text-lg font-bold">{currentUser.name}</h2>
            <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">{currentUser.role === 'mayor' ? 'Gabinete do Prefeito' : currentUser.department}</p>
          </div>
          <nav className="p-2 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <TrendingUp className="w-5 h-5" />
              Monitoramento
            </button>
            <button 
              onClick={() => setActiveTab('team_mgmt')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === 'team_mgmt' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" />
              Gestão de Equipes
            </button>
            <button 
              onClick={() => setActiveTab('comms')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === 'comms' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Radio className="w-5 h-5" />
              Linha Direta
            </button>
            <div className="h-px bg-gray-100 my-2"></div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div>
             <h1 className="text-xl font-bold text-gray-800">
               {activeTab === 'dashboard' && 'Centro de Comando'}
               {activeTab === 'team_mgmt' && 'Gestão de Recursos Humanos'}
               {activeTab === 'comms' && 'Central de Comunicação'}
             </h1>
             <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-1 inline-block">
               {new Date().toLocaleDateString()}
             </span>
           </div>
           
           {activeTab === 'dashboard' && (
             <ShareButton 
               variant="primary" 
               className="bg-gray-800 hover:bg-gray-700"
               label="Compartilhar Estatísticas"
               title="Relatório ZelaPB"
               text={`Boletim Diário ZelaPB: Hoje registramos ${stats.total} ocorrências com eficiência de resolução de ${stats.efficiency}%. Uma gestão transparente!`}
               onSuccess={() => addToast('Estatísticas copiadas para divulgação.', 'success')}
             />
           )}
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards including Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Total de Ocorrências</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Eficiência</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.efficiency}%</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              {/* RESTORED PRICING CARD */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <Banknote className="w-12 h-12 text-green-700" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase">Investimento Mensal</p>
                <p className="text-xl font-bold text-green-700">R$ 5.000,00</p>
                <p className="text-[10px] text-gray-400">Contrato Ativo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Charts Column */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[350px]">
                    <h3 className="font-bold text-gray-800 mb-4">Volume por Categoria</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={stats.categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 10}} />
                        <YAxis />
                        <Tooltip cursor={{fill: '#f0fdf4'}} />
                        <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[350px]">
                    <h3 className="font-bold text-gray-800 mb-4">Status Geral</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie data={stats.statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                          {stats.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Right Column: Crisis Feed */}
               <div className="space-y-6">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                     <h3 className="font-bold text-red-800 mb-3 flex items-center">
                       <AlertCircle className="w-5 h-5 mr-2" />
                       Atenção: Prioridade Alta
                     </h3>
                     <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                        {stats.criticalReports.length === 0 ? (
                           <p className="text-sm text-red-400 italic">Nenhum problema crítico no momento.</p>
                        ) : (
                           stats.criticalReports.map(report => (
                              <div key={report.id} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-red-500">
                                 <div className="flex justify-between items-start">
                                    <span className="font-bold text-gray-800 text-sm">{report.category}</span>
                                    <span className="text-xs text-red-500 font-bold">{report.status === 'in_progress' ? 'Em atendimento' : 'Pendente'}</span>
                                 </div>
                                 <p className="text-xs text-gray-600 mt-1 mb-2">{report.description}</p>
                                 <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {report.location}
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </>
        )}

        {activeTab === 'team_mgmt' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Register Form */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-gray-600" />
                  Cadastrar Novo Funcionário
                </h3>
                <form onSubmit={handleRegisterMember} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                    <input 
                      type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 mt-1"
                      value={newMemberName} onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Cargo</label>
                       <select 
                         className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 mt-1"
                         value={newMemberRole}
                         onChange={e => setNewMemberRole(e.target.value as 'leader' | 'member')}
                       >
                         <option value="member">Membro (Operacional)</option>
                         <option value="leader">Líder de Equipe</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Especialidade</label>
                       <select 
                         className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 mt-1"
                         value={newMemberSpecialty}
                         onChange={e => setNewMemberSpecialty(e.target.value as TeamSpecialty)}
                       >
                         <option value="Limpeza Urbana">Limpeza Urbana</option>
                         <option value="Infraestrutura">Infraestrutura</option>
                         <option value="Iluminação">Iluminação</option>
                         <option value="Geral">Geral</option>
                       </select>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Login (Usuário)</label>
                      <input 
                        type="text" required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 mt-1"
                        value={newMemberUser} onChange={e => setNewMemberUser(e.target.value)}
                        placeholder="Ex: joao.silva"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
                      <input 
                        type="text" required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 mt-1"
                        value={newMemberPass} onChange={e => setNewMemberPass(e.target.value)}
                        placeholder="Ex: 123456"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" fullWidth className="bg-gray-800 hover:bg-gray-900 text-white mt-4">
                    Cadastrar no Sistema
                  </Button>
                </form>
             </div>

             {/* Team List */}
             <div>
                <h3 className="font-bold text-gray-800 mb-4">Quadro de Funcionários ({allTeamUsers.length})</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="max-h-[500px] overflow-y-auto">
                      {allTeamUsers.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Nenhum funcionário cadastrado.</p>
                      ) : (
                        <table className="w-full text-sm text-left">
                           <thead className="bg-gray-50 text-gray-500 font-medium">
                              <tr>
                                 <th className="px-4 py-3">Nome</th>
                                 <th className="px-4 py-3">Função</th>
                                 <th className="px-4 py-3 text-right">Ações</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {allTeamUsers.map(user => (
                                 <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                       <div className="font-medium text-gray-800">{user.name}</div>
                                       <div className="text-xs text-gray-500">@{user.username}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase mr-2 ${user.role === 'leader' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                          {user.role === 'leader' ? 'Líder' : 'Membro'}
                                       </span>
                                       <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                          <Briefcase className="w-3 h-3" /> {user.specialty}
                                       </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                       <button 
                                          onClick={() => {
                                             // Use window.confirm directly inside arrow function to prevent immediate execution
                                             const confirmed = window.confirm(`Tem certeza que deseja remover ${user.name}?`);
                                             if(confirmed) {
                                                onRemoveMember(user.id);
                                                addToast('Funcionário removido.', 'info');
                                             }
                                          }}
                                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                          title="Remover Funcionário"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'comms' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Message Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                       <Megaphone className="w-5 h-5 text-gray-600" />
                       Nova Transmissão
                    </h3>
                    <p className="text-sm text-gray-500">Envie alertas para o app dos Cidadãos ou Ordens para as Equipes.</p>
                 </div>
                 
                 <form onSubmit={handleSendBroadcast} className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
                       <div className="grid grid-cols-3 gap-2">
                          <button 
                             type="button" 
                             onClick={() => setBcTarget('citizens')}
                             className={`p-2 text-sm rounded-lg border text-center transition-colors ${bcTarget === 'citizens' ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             Cidadãos
                          </button>
                          <button 
                             type="button" 
                             onClick={() => setBcTarget('teams')}
                             className={`p-2 text-sm rounded-lg border text-center transition-colors ${bcTarget === 'teams' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             Equipes
                          </button>
                          <button 
                             type="button" 
                             onClick={() => setBcTarget('all')}
                             className={`p-2 text-sm rounded-lg border text-center transition-colors ${bcTarget === 'all' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                             Todos
                          </button>
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                       <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="radio" name="priority" checked={bcPriority === 'Normal'} onChange={() => setBcPriority('Normal')} className="text-gray-600" />
                             <span className="text-sm text-gray-700">Normal</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="radio" name="priority" checked={bcPriority === 'Urgent'} onChange={() => setBcPriority('Urgent')} className="text-red-600" />
                             <span className="text-sm text-red-600 font-bold">Urgente</span>
                          </label>
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                       <input 
                         type="text" 
                         value={bcTitle}
                         onChange={(e) => setBcTitle(e.target.value)}
                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                         placeholder="Ex: Alerta de Chuva Forte"
                         required
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                       <textarea 
                         value={bcMessage}
                         onChange={(e) => setBcMessage(e.target.value)}
                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 h-32"
                         placeholder="Digite o conteúdo do comunicado..."
                         required
                       />
                    </div>

                    <Button type="submit" fullWidth className="bg-gray-800 hover:bg-gray-900 text-white">
                       <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
                    </Button>
                 </form>
              </div>

              {/* History */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                 <h3 className="font-bold text-gray-800 mb-4">Histórico de Transmissões</h3>
                 <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {broadcasts.length === 0 ? (
                       <p className="text-gray-400 italic">Nenhuma mensagem enviada.</p>
                    ) : (
                       broadcasts.slice().reverse().map(bc => (
                          <div key={bc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                             <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase
                                   ${bc.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                                `}>
                                   {bc.priority === 'Urgent' ? 'Urgente' : 'Informativo'}
                                </span>
                                <span className="text-xs text-gray-400">{bc.timestamp.toLocaleDateString()}</span>
                             </div>
                             <h4 className="font-bold text-gray-800">{bc.title}</h4>
                             <p className="text-sm text-gray-600 mt-1 mb-2">{bc.message}</p>
                             <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2 border-gray-100">
                                <span>De: {bc.senderName} ({bc.senderRole})</span>
                                <span>Para: {bc.target === 'all' ? 'Todos' : bc.target === 'citizens' ? 'Cidadãos' : 'Equipes'}</span>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};