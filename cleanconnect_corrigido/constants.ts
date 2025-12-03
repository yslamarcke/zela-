
import { Report, TeamUser, TeamInstruction, GovernmentUser, BroadcastMessage, AdminUser, Municipality, SystemConfig } from './types';

// Static constants that don't change dynamically
export const AUTHOR = "Yslamarcke Lucas dos Santos Marinho";
export const YEAR = 2025;

export const DEFAULT_CONFIG: SystemConfig = {
  appName: "ZelaPB",
  appSlogan: "Transformando denúncias em soluções.",
  version: "1.0.0",
  maintenanceMode: false,
  allowRegistrations: true,
  primaryColorName: "Emerald Green"
};

export const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    description: 'Lixo acumulado na praça central perto do banco.',
    category: 'Limpeza Urbana',
    priority: 'High',
    status: 'pending',
    location: 'Praça da Matriz',
    citizenName: 'João Silva',
    timestamp: new Date('2025-05-10T10:00:00'),
  },
  {
    id: '2',
    description: 'Buraco na calçada dificultando passagem de pedestres.',
    category: 'Infraestrutura',
    priority: 'Medium',
    status: 'in_progress',
    location: 'Rua das Flores, 120',
    citizenName: 'Maria Oliveira',
    timestamp: new Date('2025-05-11T14:30:00'),
  },
  {
    id: '3',
    description: 'Lâmpada do poste queimada.',
    category: 'Iluminação',
    priority: 'Low',
    status: 'resolved',
    location: 'Av. Brasil, 500',
    citizenName: 'Carlos Souza',
    timestamp: new Date('2025-05-09T09:15:00'),
  }
];

export const MOCK_TEAM_USERS: TeamUser[] = [
  { id: 'l1', name: 'Roberto (Líder Limpeza)', username: 'lider.limpeza', role: 'leader', specialty: 'Limpeza Urbana' },
  { id: 'l2', name: 'Ana (Líder Infra)', username: 'lider.infra', role: 'leader', specialty: 'Infraestrutura' },
  { id: 'l3', name: 'Carlos (Líder Luz)', username: 'lider.luz', role: 'leader', specialty: 'Iluminação' },
  { id: 'm1', name: 'José (Limpeza)', username: 'jose', role: 'member', specialty: 'Limpeza Urbana' },
  { id: 'm2', name: 'Marcos (Infra)', username: 'marcos', role: 'member', specialty: 'Infraestrutura' },
  { id: 'm3', name: 'Paula (Luz)', username: 'paula', role: 'member', specialty: 'Iluminação' },
];

export const MOCK_GOV_USERS: GovernmentUser[] = [
  { id: 'g1', name: 'Prefeito João', username: 'prefeito', role: 'mayor', department: 'Gabinete' },
  { id: 'g2', name: 'Sec. Maria', username: 'secretaria', role: 'secretary', department: 'Obras Públicas' },
];

export const MOCK_ADMIN: AdminUser = {
  id: 'admin_yslamarcke',
  name: 'Yslamarcke Marinho',
  username: 'yslamarcke',
  role: 'super_admin'
};

export const INITIAL_MUNICIPALITIES: Municipality[] = [
  {
    id: 'm1',
    name: 'Campina Grande',
    mayorName: 'Bruno Cunha Lima',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-01-15'),
    nextPaymentDate: new Date('2025-06-15')
  },
  {
    id: 'm2',
    name: 'João Pessoa',
    mayorName: 'Cícero Lucena',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-02-10'),
    nextPaymentDate: new Date('2025-06-10')
  },
  {
    id: 'm3',
    name: 'Patos',
    mayorName: 'Nabor Wanderley',
    contractValue: 5000,
    status: 'blocked', // Exemplo de inadimplente
    joinedDate: new Date('2024-03-01'),
    nextPaymentDate: new Date('2025-05-01')
  },
  {
    id: 'm4',
    name: 'Sousa',
    mayorName: 'Fábio Tyrone',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-04-20'),
    nextPaymentDate: new Date('2025-06-20')
  }
];

export const INITIAL_INSTRUCTIONS: TeamInstruction[] = [
  {
    id: 'i1',
    leaderName: 'Roberto (Líder Limpeza)',
    specialty: 'Limpeza Urbana',
    message: 'Atenção equipe: Priorizar coleta na zona norte hoje devido ao evento na praça.',
    timestamp: new Date()
  }
];

export const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'b1',
    senderName: 'Prefeitura Municipal',
    senderRole: 'Gabinete',
    target: 'citizens',
    title: 'Campanha Cidade Limpa',
    message: 'Neste sábado teremos um mutirão de limpeza no centro. Participe!',
    timestamp: new Date('2025-05-12T08:00:00'),
    priority: 'Normal'
  },
  {
    id: 'b2',
    senderName: 'Defesa Civil',
    senderRole: 'Emergência',
    target: 'teams',
    title: 'Alerta de Tempestade',
    message: 'Equipes de Infraestrutura e Limpeza: fiquem em alerta para possíveis quedas de árvores esta noite.',
    timestamp: new Date('2025-05-12T18:00:00'),
    priority: 'Urgent'
  }
];