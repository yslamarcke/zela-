
export type UserRole = 'citizen' | 'team' | 'government' | 'landing' | 'admin';

export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

export type TeamSpecialty = 'Limpeza Urbana' | 'Infraestrutura' | 'Iluminação' | 'Geral';

export interface SystemConfig {
  appName: string;
  appSlogan: string;
  version: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  primaryColorName: string; // Just for label, logic handles css classes
}

export interface CitizenProfile {
  name: string;
  phone: string;
  neighborhood: string;
  street: string;
}

export interface TeamUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'leader' | 'member';
  specialty: TeamSpecialty;
}

export interface GovernmentUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'mayor' | 'secretary';
  department: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: 'super_admin';
}

export interface Municipality {
  id: string;
  name: string; // Ex: João Pessoa
  mayorName: string;
  contractValue: number; // Ex: 5000
  status: 'active' | 'blocked' | 'pending';
  joinedDate: Date;
  nextPaymentDate: Date;
}

export interface TeamInstruction {
  id: string;
  leaderName: string;
  specialty: TeamSpecialty;
  message: string;
  timestamp: Date;
}

export interface BroadcastMessage {
  id: string;
  senderName: string;
  senderRole: string; // "Prefeitura", "Defesa Civil"
  target: 'citizens' | 'teams' | 'all';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'Normal' | 'Urgent';
}

export interface Report {
  id: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: ReportStatus;
  location: string;
  citizenName?: string;
  contactPhone?: string;
  timestamp: Date;
  imageUrl?: string;
  aiAnalysis?: string;
}

export interface DashboardStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  efficiency: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}