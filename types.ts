
export enum UserRole {
  SIH = 'SIH',
  SIS_CSREF = 'SIS_CSREF',
  SIS_CSCOM = 'SIS_CSCOM',
  SIS_CABINET = 'SIS_CABINET',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_LOCAL = 'ADMIN_LOCAL',
  MINISTERE_SIS = 'MINISTERE_SIS',
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  establishment: string;
}

export interface StatsData {
  totalPatients: number;
  consultationsToday: number;
  activeHospitalizations: number;
  occupancyRate: number;
}

export interface ConsultationDataPoint {
  date: string;
  count: number;
}

export interface EpidemiologyDataPoint {
  name: string;
  value: number;
}

export enum NotificationType {
  STOCK = 'STOCK',
  ADMISSION = 'ADMISSION',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  service: string;
  specialty: string;
  establishment: string;
  diagnosis: string;
}

export interface Hospitalisation {
  id: string;
  patientId: string;
  patientName: string;
  admissionDate: string;
  dischargeDate?: string;
  service: string;
  status: 'Stable' | 'En observation' | 'Critique' | 'Sorti';
  diagnosis: string;
  establishment: string;
}

export interface Service {
    name: string;
    head: string;
    capacity: number;
    unit: string;
    establishment: string;
}

export interface Specialite {
    name: string;
    linkedService: string;
    establishment: string;
}

export interface EpidemiologyCase {
  id: string;
  patientName: string;
  disease: string;
  caseDate: string;
  location: string; // Service or Unit
  establishment: string;
}