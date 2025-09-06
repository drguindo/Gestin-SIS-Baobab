/**
 * @file Affiche la structure principale de l'application après la connexion.
 * Ce composant orchestre l'affichage de la barre latérale (Sidebar), de l'en-tête (Header)
 * et du contenu de la page active. Il gère également l'état des notifications.
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { User, Notification } from '../../types';
import { NotificationType } from '../../types';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from '../dashboard/DashboardPage';
import HospitalisationsPage from '../pages/HospitalisationsPage';
import RessourcesPage from '../pages/RessourcesPage';
import RapportsPage from '../pages/RapportsPage';
import PatientsPage from '../pages/PatientsPage';
import EtablissementsPage from '../pages/admin/EtablissementsPage';
import UtilisateursPage from '../pages/admin/UtilisateursPage';
import ModulesPage from '../pages/admin/ModulesPage';
import ServicesPage from '../pages/admin/ServicesPage';
import SpecialitesPage from '../pages/admin/SpecialitesPage';
import DataSharingPage from '../pages/admin/DataSharingPage';
import ConsultationsPage from '../pages/ConsultationsPage';
import EpidemiologiePage from '../pages/EpidemiologiePage';
import ReferencementsPage from '../pages/ReferencementsPage';
import FacturationPage from '../pages/FacturationPage';
import CampagnesPage from '../pages/CampagnesPage';
import SurveillanceRAMPage from '../pages/SurveillanceRAMPage';

/**
 * Props pour le composant DashboardLayout.
 * @interface DashboardLayoutProps
 */
interface DashboardLayoutProps {
  /** L'objet de l'utilisateur actuellement connecté. */
  user: User;
  /** Fonction de rappel pour gérer la déconnexion de l'utilisateur. */
  onLogout: () => void;
}

/**
 * Données de notifications simulées pour la démonstration.
 * @const {Notification[]}
 */
const mockNotifications: Notification[] = [
    { id: 1, type: NotificationType.ADMISSION, title: "Nouvelle admission critique", message: "Patient John Doe admis aux urgences. État critique.", timestamp: "il y a 2 minutes", read: false },
    { id: 2, type: NotificationType.STOCK, title: "Stock de Paracétamol faible", message: "Le stock de Paracétamol 500mg est en dessous du seuil critique (15 boîtes restantes).", timestamp: "il y a 35 minutes", read: false },
    { id: 3, type: NotificationType.SYSTEM, title: "Maintenance du système", message: "Une maintenance est prévue ce soir à 23:00.", timestamp: "il y a 2 heures", read: true },
    { id: 4, type: NotificationType.ADMISSION, title: "Nouvelle admission", message: "Patient Jane Smith admise en Maternité.", timestamp: "il y a 4 heures", read: true },
    { id: 5, type: NotificationType.STOCK, title: "Commande reçue", message: "La commande de matériel chirurgical a été réceptionnée.", timestamp: "hier", read: true },
];

/**
 * La disposition principale du tableau de bord après l'authentification.
 * Il comprend la barre latérale, l'en-tête et la zone de contenu principale. Il gère l'état
 * de la page active et l'état des notifications (lecture, non-lecture).
 *
 * @param {DashboardLayoutProps} props - Les props du composant.
 * @returns {React.ReactElement} La mise en page du tableau de bord.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  /** État pour la visibilité de la barre latérale sur les appareils mobiles. */
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  /** État pour suivre la page actuellement affichée dans la zone de contenu. */
  const [activePage, setActivePage] = useState('Tableau de bord');
  /** État pour gérer la liste des notifications. */
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  /**
   * Marque une notification spécifique comme lue.
   * @param {number} id - L'ID de la notification à marquer comme lue.
   */
  const handleMarkAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  /**
   * Marque toutes les notifications comme lues.
   */
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  /**
   * Simule une notification push en temps réel (type WebSocket).
   * Ajoute une nouvelle notification après 7 secondes pour démontrer la réactivité.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
        const newNotification: Notification = {
            id: Date.now(),
            type: NotificationType.ADMISSION,
            title: "ALERTE TEMPS RÉEL (Simulée)",
            message: "Nouvelle admission critique via le SAMU.",
            timestamp: "à l'instant",
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, 7000); // Se déclenche après 7 secondes

    return () => clearTimeout(timer);
}, []);


  /**
   * Rend le composant de la page appropriée en fonction de l'état `activePage`.
   * C'est un simple système de routage côté client basé sur l'état.
   * @returns {React.ReactElement} Le composant de la page à afficher.
   */
  const renderContent = () => {
    switch (activePage) {
      case 'Tableau de bord':
        return <DashboardPage user={user} />;
      case 'Consultations':
        return <ConsultationsPage user={user} />;
      case 'Hospitalisations':
        return <HospitalisationsPage user={user} />;
      case 'Ressources':
        return <RessourcesPage />;
      case 'Rapports':
        return <RapportsPage />;
      case 'Patients':
        return <PatientsPage />;
      case 'Épidémiologie':
        return <EpidemiologiePage user={user} />;
      case 'Surveillance RAM':
        return <SurveillanceRAMPage user={user} />;
      case 'Référencements':
        return <ReferencementsPage user={user} />;
      case 'Facturation':
        return <FacturationPage />;
      case 'Campagnes':
        return <CampagnesPage user={user} />;
      // Super Admin & Admin Local pages
      case 'Établissements':
        return <EtablissementsPage user={user} />;
      case 'Utilisateurs':
        return <UtilisateursPage user={user} />;
      case 'Modules':
        return <ModulesPage />;
      case 'Services':
        return <ServicesPage user={user} />;
      case 'Spécialités':
        return <SpecialitesPage user={user} />;
      case 'Partage de données':
        return <DataSharingPage />;
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            user={user} 
            onLogout={onLogout} 
            onMenuClick={() => setSidebarOpen(true)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;