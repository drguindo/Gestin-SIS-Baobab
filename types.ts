/**
 * @file Ce fichier contient tous les types et interfaces TypeScript de base
 * utilisés dans l'application. Il définit les structures de données pour les utilisateurs,
 * les dossiers médicaux, les notifications, et plus encore, servant de source unique de vérité
 * pour le modèle de données de l'application.
 */

/**
 * Définit les rôles possibles qu'un utilisateur peut avoir au sein du système.
 * Chaque rôle accorde des permissions et des niveaux d'accès différents.
 * @enum {string}
 */
export enum UserRole {
  /** Agent du Système d'Information Hospitalier - Niveau Hôpital. Gère les données d'un hôpital spécifique. */
  SIH = 'SIH',
  /** Agent du Système d'Information Sanitaire - Niveau Centre de Santé de Référence (CSRéf). */
  SIS_CSREF = 'SIS_CSREF',
  /** Agent du Système d'Information Sanitaire - Niveau Centre de Santé Communautaire (CSCOM). */
  SIS_CSCOM = 'SIS_CSCOM',
  /** Personnel d'un cabinet médical privé. */
  SIS_CABINET = 'SIS_CABINET',
  /** Super Administrateur avec un accès complet à toute la plateforme. */
  SUPER_ADMIN = 'SUPER_ADMIN',
  /** Administrateur local avec des privilèges d'administration pour un établissement spécifique. */
  ADMIN_LOCAL = 'ADMIN_LOCAL',
  /** Superviseur du Ministère de la Santé avec un accès en lecture seule à l'échelle nationale. */
  MINISTERE_SIS = 'MINISTERE_SIS',
}

/**
 * Représente un utilisateur authentifié dans l'application.
 * @interface User
 */
export interface User {
  /** L'identifiant unique de l'utilisateur. */
  id: number;
  /** Le nom complet de l'utilisateur. */
  name: string;
  /** Le rôle de l'utilisateur, qui détermine ses permissions. */
  role: UserRole;
  /** L'établissement de santé auquel l'utilisateur est affilié. */
  establishment: string;
}

/**
 * Structure de données pour les cartes de statistiques du tableau de bord.
 * @interface StatsData
 */
export interface StatsData {
  /** Le nombre total de patients enregistrés dans l'établissement. */
  totalPatients: number;
  /** Le nombre de consultations effectuées aujourd'hui. */
  consultationsToday: number;
  /** Le nombre de patients actuellement hospitalisés. */
  activeHospitalizations: number;
  /** Le taux d'occupation des lits, en pourcentage. */
  occupancyRate: number;
}

/**
 * Représente un point de données pour le graphique de l'historique des consultations.
 * @interface ConsultationDataPoint
 */
export interface ConsultationDataPoint {
  /** La date du point de données (généralement formatée comme un jour de la semaine). */
  date: string;
  /** Le nombre de consultations pour cette date. */
  count: number;
}

/**
 * Représente un point de données pour le graphique de répartition épidémiologique.
 * @interface EpidemiologyDataPoint
 */
export interface EpidemiologyDataPoint {
  /** Le nom de la pathologie ou de la catégorie. */
  name: string;
  /** Le nombre de cas ou la valeur associée. */
  value: number;
}

/**
 * Définit les différents types de notifications dans le système.
 * @enum {string}
 */
export enum NotificationType {
  /** Notification liée à la gestion des stocks (par ex., stock faible). */
  STOCK = 'STOCK',
  /** Notification liée à l'admission d'un patient. */
  ADMISSION = 'ADMISSION',
  /** Notification générale du système (par ex., maintenance). */
  SYSTEM = 'SYSTEM',
}

/**
 * Structure d'une notification affichée à l'utilisateur.
 * @interface Notification
 */
export interface Notification {
  /** Identifiant unique de la notification. */
  id: number;
  /** Le type de la notification. */
  type: NotificationType;
  /** Le titre de la notification. */
  title: string;
  /** Le message détaillé de la notification. */
  message: string;
  /** Horodatage relatif de la notification (par ex., "il y a 2 minutes"). */
  timestamp: string;
  /** Statut de lecture de la notification. */
  read: boolean;
}

/**
 * Représente une consultation médicale enregistrée.
 * @interface Consultation
 */
export interface Consultation {
  /** Identifiant unique de la consultation. */
  id: string;
  /** Identifiant du patient associé. */
  patientId: string;
  /** Nom du patient. */
  patientName: string;
  /** Nom du médecin ou du soignant. */
  doctorName: string;
  /** Date de la consultation. */
  date: string;
  /** Service où la consultation a eu lieu. */
  service: string;
  /** Spécialité médicale concernée. */
  specialty: string;
  /** Établissement où la consultation a eu lieu. */
  establishment: string;
  /** Diagnostic principal posé lors de la consultation. */
  diagnosis: string;
}

/**
 * Représente une hospitalisation enregistrée.
 * @interface Hospitalisation
 */
export interface Hospitalisation {
  /** Identifiant unique de l'hospitalisation. */
  id: string;
  /** Identifiant du patient associé. */
  patientId: string;
  /** Nom du patient. */
  patientName: string;
  /** Date d'admission du patient. */
  admissionDate: string;
  /** Date de sortie du patient (optionnelle). */
  dischargeDate?: string;
  /** Service d'hospitalisation. */
  service: string;
  /** État clinique du patient. */
  status: 'Stable' | 'En observation' | 'Critique' | 'Sorti';
  /** Diagnostic principal à l'admission. */
  diagnosis: string;
  /** Établissement de l'hospitalisation. */
  establishment: string;
}

/**
 * Représente un service médical au sein d'un établissement.
 * @interface Service
 */
export interface Service {
    /** Nom du service (par ex., "Pédiatrie"). */
    name: string;
    /** Nom du chef de service. */
    head: string;
    /** Capacité en lits du service. */
    capacity: number;
    /** Unité fonctionnelle associée (par ex., "Bloc Opératoire"). */
    unit: string;
    /** Établissement auquel le service appartient. */
    establishment: string;
}

/**
 * Représente une spécialité médicale offerte par un établissement.
 * @interface Specialite
 */
export interface Specialite {
    /** Nom de la spécialité (par ex., "Cardiologie"). */
    name: string;
    /** Service auquel la spécialité est rattachée. */
    linkedService: string;
    /** Établissement où la spécialité est offerte. */
    establishment: string;
}

/**
 * Représente un cas déclaré pour la surveillance épidémiologique.
 * @interface EpidemiologyCase
 */
export interface EpidemiologyCase {
  /** Identifiant unique du cas. */
  id: string;
  /** Nom du patient (peut être anonymisé). */
  patientName: string;
  /** Maladie à déclaration obligatoire. */
  disease: string;
  /** Date de la détection du cas. */
  caseDate: string;
  /** Localisation du cas au sein de l'établissement. */
  location: string;
  /** Établissement déclarant. */
  establishment: string;
}
