
import React, { useState } from 'react';
import { UserRole, Report, ReportStatus, ToastMessage, CitizenProfile, TeamUser, TeamInstruction, GovernmentUser, BroadcastMessage, AdminUser, Municipality, SystemConfig } from './types';
import { INITIAL_REPORTS, INITIAL_INSTRUCTIONS, MOCK_TEAM_USERS, INITIAL_BROADCASTS, INITIAL_MUNICIPALITIES, DEFAULT_CONFIG } from './constants';
import { LandingView } from './components/LandingView';
import { CitizenView } from './components/CitizenView';
import { TeamView } from './components/TeamView';
import { CityHallView } from './components/CityHallView';
import { AdminView } from './components/AdminView';
import { ToastContainer } from './components/Toast';
import { LayoutDashboard, Users, User, ArrowLeft, Mountain, Hammer, Construction } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // System Config State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_CONFIG);

  // States new features
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile | null>(null);
  
  // Team State
  const [currentTeamUser, setCurrentTeamUser] = useState<TeamUser | null>(null);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>(MOCK_TEAM_USERS);
  const [teamInstructions, setTeamInstructions] = useState<TeamInstruction[]>(INITIAL_INSTRUCTIONS);

  // Government State
  const [currentGovUser, setCurrentGovUser] = useState<GovernmentUser | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(INITIAL_BROADCASTS);

  // Admin State
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [municipalities, setMunicipalities] = useState<Municipality[]>(INITIAL_MUNICIPALITIES);

  // --- TOAST LOGIC ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- REPORT LOGIC ---
  const handleAddReport = (data: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    const newReport: Report = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date(),
    };
    setReports([...reports, newReport]);
  };

  const handleUpdateStatus = (id: string, status: ReportStatus) => {
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  // --- TEAM MANAGEMENT LOGIC ---
  const handleAddInstruction = (message: string) => {
    if (!currentTeamUser) return;
    const newInstruction: TeamInstruction = {
      id: Date.now().toString(),
      leaderName: currentTeamUser.name,
      specialty: currentTeamUser.specialty,
      message,
      timestamp: new Date()
    };
    setTeamInstructions([...teamInstructions, newInstruction]);
  };

  const handleRegisterTeamMember = (newUser: TeamUser) => {
    setTeamUsers([...teamUsers, newUser]);
  };

  const handleRemoveTeamMember = (userId: string) => {
    setTeamUsers(prev => prev.filter(u => u.id !== userId));
  };

  // --- GOVERNMENT LOGIC ---
  const handleAddBroadcast = (title: string, message: string, target: 'citizens' | 'teams' | 'all', priority: 'Normal' | 'Urgent') => {
    if (!currentGovUser) return;
    const newBroadcast: BroadcastMessage = {
      id: Date.now().toString(),
      senderName: currentGovUser.name,
      senderRole: currentGovUser.role === 'mayor' ? 'Prefeito' : currentGovUser.department,
      target,
      title,
      message,
      priority,
      timestamp: new Date()
    };
    setBroadcasts([...broadcasts, newBroadcast]);
  };

  // --- ADMIN LOGIC ---
  const handleUpdateMunicipalityStatus = (id: string, status: Municipality['status']) => {
    setMunicipalities(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleNavigate = (view: UserRole) => {
    setCurrentView(view);
  };

  // --- MAINTENANCE MODE CHECK ---
  // Returns true if blocked, but allows Admin access
  const isBlockedByMaintenance = () => {
    return systemConfig.maintenanceMode && currentView !== 'admin';
  };

  // Render Navigation Header (except for landing and admin which has its own)
  const renderHeader = () => {
    if (currentView === 'landing' || currentView === 'admin' || isBlockedByMaintenance()) return null;

    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setCurrentView('landing')}
               className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
               title="Voltar ao início"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-2">
                <Mountain className="w-6 h-6 text-emerald-700" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                  {systemConfig.appName}
                </h1>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                {currentView === 'citizen' && <User className="w-4 h-4 text-emerald-600" />}
                {currentView === 'team' && <Users className="w-4 h-4 text-amber-600" />}
                {currentView === 'government' && <LayoutDashboard className="w-4 h-4 text-gray-800" />}
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {currentView === 'government' ? 'Prefeitura' : 
                   currentView === 'team' ? 'Equipe' : 'Cidadão'}
                </span>
             </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    // Maintenance Mode Overlay
    if (isBlockedByMaintenance()) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg border-b-8 border-amber-400">
             <Construction className="w-20 h-20 text-amber-500 mx-auto mb-6" />
             <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema em Manutenção</h1>
             <p className="text-gray-500 mb-8">
               O aplicativo <strong>{systemConfig.appName}</strong> está passando por melhorias. 
               Por favor, aguarde e tente novamente em alguns instantes.
             </p>
             <div className="flex justify-center gap-4">
               <Button onClick={() => window.location.reload()} variant="outline">
                 Tentar Novamente
               </Button>
               {/* Secret backdoor to admin */}
               <Button onClick={() => setCurrentView('admin')} variant="secondary" className="opacity-0 hover:opacity-100 transition-opacity">
                 Admin
               </Button>
             </div>
          </div>
          <p className="mt-8 text-gray-400 text-sm">v{systemConfig.version}</p>
        </div>
      );
    }

    switch (currentView) {
      case 'landing':
        return <LandingView onEnterApp={handleNavigate} config={systemConfig} />;
      case 'citizen':
        return (
          <CitizenView 
            onSubmitReport={handleAddReport} 
            reports={reports} 
            profile={citizenProfile}
            onRegister={setCitizenProfile}
            addToast={addToast}
            broadcasts={broadcasts}
          />
        );
      case 'team':
        return (
          <TeamView 
            reports={reports} 
            onUpdateStatus={handleUpdateStatus} 
            currentUser={currentTeamUser}
            allUsers={teamUsers}
            onLogin={setCurrentTeamUser}
            onLogout={() => setCurrentTeamUser(null)}
            instructions={teamInstructions}
            onAddInstruction={handleAddInstruction}
            addToast={addToast}
            broadcasts={broadcasts}
          />
        );
      case 'government':
        return (
          <CityHallView 
            reports={reports} 
            currentUser={currentGovUser}
            onLogin={setCurrentGovUser}
            onLogout={() => setCurrentGovUser(null)}
            broadcasts={broadcasts}
            onAddBroadcast={handleAddBroadcast}
            addToast={addToast}
            allTeamUsers={teamUsers}
            onRegisterMember={handleRegisterTeamMember}
            onRemoveMember={handleRemoveTeamMember}
          />
        );
      case 'admin':
        return (
          <AdminView 
             currentUser={currentAdminUser}
             onLogin={setCurrentAdminUser}
             onLogout={() => {
               setCurrentAdminUser(null);
               setCurrentView('landing');
             }}
             municipalities={municipalities}
             onUpdateMunicipalityStatus={handleUpdateMunicipalityStatus}
             addToast={addToast}
             systemConfig={systemConfig}
             onUpdateConfig={setSystemConfig}
          />
        );
      default:
        return <LandingView onEnterApp={handleNavigate} config={systemConfig} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {renderHeader()}
      <main className={currentView !== 'landing' && currentView !== 'admin' && !isBlockedByMaintenance() ? 'py-6' : ''}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
