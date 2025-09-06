/**
 * @file Ce fichier contient le composant Header (en-tête) de l'application.
 * Il affiche des informations sur l'utilisateur et l'établissement,
 * un bouton de déconnexion, et l'icône de notifications avec son panneau.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { User, Notification } from '../../types';
import { LogoutIcon, MenuIcon, BellIcon } from '../ui/icons';
import NotificationsPanel from './NotificationsPanel';

/**
 * Props pour le composant Header.
 * @interface HeaderProps
 */
interface HeaderProps {
  /** L'objet utilisateur actuellement connecté. */
  user: User;
  /** Fonction de rappel pour la déconnexion. */
  onLogout: () => void;
  /** Fonction de rappel pour ouvrir le menu latéral sur mobile. */
  onMenuClick: () => void;
  /** La liste des notifications à afficher. */
  notifications: Notification[];
  /** Fonction de rappel pour marquer une notification comme lue. */
  onMarkAsRead: (id: number) => void;
  /** Fonction de rappel pour marquer toutes les notifications comme lues. */
  onMarkAllAsRead: () => void;
}

/**
 * Le composant Header est affiché en haut de la page sur l'ensemble de l'application
 * après la connexion. Il contient des informations contextuelles sur l'utilisateur,
 * un accès aux notifications et la fonctionnalité de déconnexion.
 *
 * @param {HeaderProps} props - Les props du composant.
 * @returns {React.ReactElement} Le composant d'en-tête.
 */
const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuClick, notifications, onMarkAsRead, onMarkAllAsRead }) => {
  /** État pour contrôler l'ouverture et la fermeture du panneau de notifications. */
  const [isPanelOpen, setPanelOpen] = useState(false);
  /** Compte le nombre de notifications non lues pour l'affichage du badge. */
  const unreadCount = notifications.filter(n => !n.read).length;
  /** Référence au DOM du panneau de notifications pour détecter les clics à l'extérieur. */
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Effet pour gérer la fermeture du panneau de notifications lorsqu'un utilisateur
   * clique à l'extérieur de celui-ci.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-secondary shadow-md">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden mr-4">
          <MenuIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{user.establishment}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.name} - <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelOpen(prev => !prev)}
            className="relative text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 focus:outline-none transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {isPanelOpen && (
            <NotificationsPanel 
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={() => {
                onMarkAllAsRead();
              }}
              onClose={() => setPanelOpen(false)}
            />
          )}
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
