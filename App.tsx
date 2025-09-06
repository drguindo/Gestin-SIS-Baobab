/**
 * @file Composant racine de l'application.
 * Ce composant gère l'état d'authentification de l'utilisateur et affiche
 * soit la page de connexion, soit le tableau de bord principal en fonction de cet état.
 */

import React, { useState, useCallback } from 'react';
import type { User } from './types';
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';

/**
 * Le composant principal et racine de l'application SIS.
 *
 * Il utilise un état local `currentUser` pour suivre l'utilisateur connecté.
 * - Si `currentUser` est `null`, il affiche le composant `LoginPage`.
 * - Si un utilisateur est connecté (`currentUser` est un objet `User`), il affiche
 *   le `DashboardLayout`, en lui passant les informations de l'utilisateur et une
 *   fonction de déconnexion.
 *
 * @returns {React.ReactElement} Le composant racine de l'application.
 */
const App: React.FC = () => {
  /**
   * État pour stocker les informations de l'utilisateur actuellement connecté.
   * `null` si aucun utilisateur n'est connecté.
   */
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /**
   * Gère la connexion de l'utilisateur.
   * Mémorisé avec `useCallback` pour optimiser les performances en évitant
   * de recréer la fonction à chaque rendu.
   * @param {User} user - L'objet utilisateur provenant de la page de connexion.
   */
  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  /**
   * Gère la déconnexion de l'utilisateur.
   * Mémorisé avec `useCallback` pour les mêmes raisons d'optimisation.
   */
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <div className="min-h-screen bg-light text-secondary dark:bg-dark dark:text-light">
      {currentUser ? (
        <DashboardLayout user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
