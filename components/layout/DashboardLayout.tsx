
import React, { useState, useCallback } from 'react';
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


interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const mockNotifications: Notification[] = [
    { id: 1, type: NotificationType.ADMISSION, title: "Nouvelle admission critique", message: "Patient John Doe admis aux urgences. État critique.", timestamp: "il y a 2 minutes", read: false },
    { id: 2, type: NotificationType.STOCK, title: "Stock de Paracétamol faible", message: "Le stock de Paracétamol 500mg est en dessous du seuil critique (15 boîtes restantes).", timestamp: "il y a 35 minutes", read: false },
    { id: 3, type: NotificationType.SYSTEM, title: "Maintenance du système", message: "Une maintenance est prévue ce soir à 23:00.", timestamp: "il y a 2 heures", read: true },
    { id: 4, type: NotificationType.ADMISSION, title: "Nouvelle admission", message: "Patient Jane Smith admise en Maternité.", timestamp: "il y a 4 heures", read: true },
    { id: 5, type: NotificationType.STOCK, title: "Commande reçue", message: "La commande de matériel chirurgical a été réceptionnée.", timestamp: "hier", read: true },
];


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Tableau de bord');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

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
        // FIX: Pass user prop to EpidemiologiePage component.
        return <EpidemiologiePage user={user} />;
      case 'Référencements':
        return <ReferencementsPage />;
      case 'Facturation':
        return <FacturationPage />;
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
