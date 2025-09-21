/**
 * @file Ce fichier contient le composant Sidebar (barre latérale) qui gère la navigation principale.
 * Il affiche dynamiquement les liens de navigation en fonction du rôle de l'utilisateur connecté.
 */

import React from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { ChartPieIcon, DocumentTextIcon, UsersIcon, GlobeAltIcon, ArrowTrendingUpIcon, CreditCardIcon, StethoscopeIcon, XMarkIcon, BedIcon, WrenchScrewdriverIcon, DocumentChartBarIcon, BuildingStorefrontIcon, PuzzlePieceIcon, CogIcon, ShareIcon, MegaphoneIcon, BeakerIcon } from '../ui/icons';

/**
 * Props pour le composant Sidebar.
 * @interface SidebarProps
 */
interface SidebarProps {
  /** L'objet de l'utilisateur actuellement connecté. */
  user: User;
  /** État booléen indiquant si la barre latérale est ouverte (pour mobile). */
  isOpen: boolean;
  /** Fonction pour modifier l'état d'ouverture de la barre latérale. */
  setIsOpen: (isOpen: boolean) => void;
  /** Le nom de la page actuellement active. */
  activePage: string;
  /** Fonction pour définir la page active. */
  setActivePage: (page: string) => void;
}

/** Liens de navigation communs à plusieurs rôles d'utilisateurs. */
const commonLinks = [
  { name: 'Tableau de bord', icon: <ChartPieIcon className="w-6 h-6" /> },
  { name: 'Consultations', icon: <DocumentTextIcon className="w-6 h-6" /> },
  { name: 'Patients', icon: <UsersIcon className="w-6 h-6" /> },
];

/**
 * Configuration des liens de navigation spécifiques à chaque rôle d'utilisateur.
 * C'est le cœur du système de contrôle d'accès basé sur les rôles (RBAC) pour la navigation.
 * @type {Record<UserRole, { name: string; icon: React.ReactNode }[]>}
 */
const roleLinks: Record<UserRole, { name: string; icon: React.ReactNode }[]> = {
  [UserRole.SUPER_ADMIN]: [
    { name: 'Tableau de bord', icon: <ChartPieIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
    { name: 'Établissements', icon: <BuildingStorefrontIcon className="w-6 h-6" /> },
    { name: 'Utilisateurs', icon: <UsersIcon className="w-6 h-6" /> },
    { name: 'Services', icon: <CogIcon className="w-6 h-6" /> },
    { name: 'Spécialités', icon: <StethoscopeIcon className="w-6 h-6" /> },
    { name: 'Modules', icon: <PuzzlePieceIcon className="w-6 h-6" /> },
  ],
  [UserRole.ADMIN_LOCAL]: [
    { name: 'Tableau de bord', icon: <ChartPieIcon className="w-6 h-6" /> },
    { name: 'Consultations', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
    { name: 'Services', icon: <CogIcon className="w-6 h-6" /> },
    { name: 'Utilisateurs', icon: <UsersIcon className="w-6 h-6" /> },
    { name: 'Spécialités', icon: <StethoscopeIcon className="w-6 h-6" /> },
    { name: 'Partage de données', icon: <ShareIcon className="w-6 h-6" /> },
  ],
  [UserRole.SIH]: [
    ...commonLinks,
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
    { name: 'Ressources', icon: <WrenchScrewdriverIcon className="w-6 h-6" /> },
    { name: 'Rapports', icon: <DocumentChartBarIcon className="w-6 h-6" /> },
  ],
  [UserRole.SIS_CSREF]: [
    ...commonLinks,
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
  ],
  [UserRole.SIS_CSCOM]: [
    ...commonLinks,
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
  ],
  [UserRole.SIS_CABINET]: [
    ...commonLinks,
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Facturation', icon: <CreditCardIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
  ],
  [UserRole.MINISTERE_SIS]: [
    { name: 'Tableau de bord', icon: <ChartPieIcon className="w-6 h-6" /> },
    { name: 'Consultations', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Campagnes', icon: <MegaphoneIcon className="w-6 h-6" /> },
  ],
  [UserRole.SIS_INRSP]: [
    { name: 'Tableau de bord', icon: <ChartPieIcon className="w-6 h-6" /> },
    { name: 'Consultations', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { name: 'Hospitalisations', icon: <BedIcon className="w-6 h-6" /> },
    { name: 'Épidémiologie', icon: <GlobeAltIcon className="w-6 h-6" /> },
    { name: 'Surveillance RAM', icon: <BeakerIcon className="w-6 h-6" /> },
    { name: 'Référencements', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
    { name: 'Rapports', icon: <DocumentChartBarIcon className="w-6 h-6" /> },
  ],
};

/**
 * Props pour le composant NavLink.
 * @interface NavLinkProps
 */
interface NavLinkProps {
  /** Fonction à exécuter lors du clic. */
  onClick: () => void;
  /** Le contenu du lien (icône et texte). */
  children: React.ReactNode;
  /** Booléen indiquant si le lien est actif. */
  isActive?: boolean;
}

/**
 * Un composant de bouton stylisé pour la navigation dans la barre latérale.
 * @param {NavLinkProps} props - Les props du composant.
 */
const NavLink: React.FC<NavLinkProps> = ({ onClick, children, isActive }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 my-1 text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
);

/**
 * Le composant de la barre latérale de navigation.
 * Il est responsive et s'affiche de manière permanente sur les grands écrans
 * et comme un menu coulissant sur les petits écrans.
 *
 * @param {SidebarProps} props - Les props du composant.
 * @returns {React.ReactElement} Le composant de la barre latérale.
 */
const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, setIsOpen, activePage, setActivePage }) => {
  const links = roleLinks[user.role];

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`flex flex-col w-64 bg-white dark:bg-secondary text-gray-800 dark:text-gray-100 transition-transform duration-300 ease-in-out fixed lg:static lg:translate-x-0 h-full z-30 shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                 <StethoscopeIcon className="w-8 h-8 text-primary"/>
                 <span className="ml-3 text-xl font-bold">SIS Module</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <nav className="flex-1 p-4">
          {links.map((link) => (
            <NavLink 
                key={link.name} 
                onClick={() => {
                    setActivePage(link.name);
                    if (window.innerWidth < 1024) { // Close sidebar on mobile after click
                        setIsOpen(false);
                    }
                }} 
                isActive={activePage === link.name}
            >
              {link.icon}
              <span className="mx-4 font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">© 2024 SIS Mali</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
