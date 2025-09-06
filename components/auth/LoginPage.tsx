/**
 * @file Ce fichier contient le composant de la page de connexion.
 * Pour des raisons de démonstration, il simule la connexion en permettant à l'utilisateur
 * de choisir un profil parmi une liste prédéfinie.
 */

import React from 'react';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { HospitalIcon, BriefcaseIcon, BuildingIcon, StethoscopeIcon, ShieldCheckIcon, BeakerIcon } from '../ui/icons';

/**
 * Props pour le composant LoginPage.
 * @interface LoginPageProps
 */
interface LoginPageProps {
  /**
   * Fonction de rappel (callback) appelée lorsqu'un utilisateur se connecte avec succès.
   * @param {User} user - L'objet utilisateur du profil sélectionné.
   */
  onLogin: (user: User) => void;
}

/**
 * Données simulées pour les utilisateurs. Dans une application réelle,
 * ces informations proviendraient d'une base de données via une API.
 * @const {User[]}
 */
const mockUsers: User[] = [
  { id: 1, name: 'Super Admin', role: UserRole.SUPER_ADMIN, establishment: 'Plateforme Nationale SIS' },
  { id: 8, name: 'Superviseur National', role: UserRole.MINISTERE_SIS, establishment: 'Ministère de la Santé' },
  { id: 9, name: 'Chargé SIS INRSP', role: UserRole.SIS_INRSP, establishment: 'INRSP Bamako' },
  { id: 2, name: 'Admin Local', role: UserRole.ADMIN_LOCAL, establishment: 'Hôpital Sominé Dolo' },
  { id: 3, name: 'Dr. Aminata Traoré', role: UserRole.SIH, establishment: 'Hôpital Sominé Dolo' },
  { id: 4, name: 'Moussa Diarra', role: UserRole.SIS_CSREF, establishment: 'CSRéf de Djenné' },
  { id: 5, name: 'Fatoumata Coulibaly', role: UserRole.SIS_CSCOM, establishment: 'CSCOM de Sangha' },
  { id: 6, name: 'Dr. Jean-Pierre Kante', role: UserRole.SIS_CABINET, establishment: 'Cabinet Médical Étoile' },
  { id: 7, name: 'Dr. Mariam Diallo', role: UserRole.SIS_CABINET, establishment: 'Cabinet Médical Nando' },
];

/**
 * Configuration pour l'affichage des rôles (icône et description).
 * Associe chaque `UserRole` à des éléments visuels pour une meilleure expérience utilisateur.
 * @const
 */
const roleConfig = {
    [UserRole.SUPER_ADMIN]: { icon: <ShieldCheckIcon className="w-8 h-8 text-primary" />, description: "Administration totale de la plateforme" },
    [UserRole.ADMIN_LOCAL]: { icon: <ShieldCheckIcon className="w-8 h-8 text-yellow-500" />, description: "Administration de l'établissement" },
    [UserRole.SIH]: { icon: <HospitalIcon className="w-8 h-8 text-primary" />, description: "Chargé S.I. Hôpital" },
    [UserRole.SIS_CSREF]: { icon: <BuildingIcon className="w-8 h-8 text-primary" />, description: "Chargé S.I.S. CSRéf" },
    [UserRole.SIS_CSCOM]: { icon: <StethoscopeIcon className="w-8 h-8 text-primary" />, description: "Chargé S.I.S. CSCOM" },
    [UserRole.SIS_CABINET]: { icon: <BriefcaseIcon className="w-8 h-8 text-primary" />, description: "Cabinet Médical Privé" },
    [UserRole.MINISTERE_SIS]: { icon: <ShieldCheckIcon className="w-8 h-8 text-blue-700" />, description: "Supervision Nationale SIS" },
    [UserRole.SIS_INRSP]: { icon: <BeakerIcon className="w-8 h-8 text-purple-600" />, description: "Centralisation & Surveillance Nationale" },
}

/**
 * Affiche l'écran de connexion où l'utilisateur peut sélectionner un profil de démonstration.
 * Chaque profil est présenté sous forme de carte avec des informations claires sur le rôle
 * et l'établissement. Un clic sur "Se connecter" déclenche la fonction `onLogin` du parent.
 *
 * @param {LoginPageProps} props - Les props du composant.
 * @returns {React.ReactElement} La page de sélection de profil.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary">Module SIS</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Veuillez sélectionner un profil pour accéder au tableau de bord.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-secondary rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-4">
                {roleConfig[user.role].icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{roleConfig[user.role].description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">{user.establishment}</p>
              <button
                onClick={() => onLogin(user)}
                className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors"
              >
                Se connecter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
