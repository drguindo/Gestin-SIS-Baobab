/**
 * @file Ce fichier contient un hook React personnalisé, `useModal`,
 * pour abstraire et simplifier la logique de gestion de l'état d'une fenêtre modale.
 */

import { useState, useCallback } from 'react';

/**
 * Un hook personnalisé pour gérer l'état d'ouverture/fermeture d'un composant modal.
 * Il encapsule la logique `useState` et fournit des gestionnaires d'événements mémorisés
 * pour contrôler la visibilité de la modale.
 *
 * @param {boolean} [initialState=false] - L'état initial de la modale (ouverte ou fermée).
 * @returns {{
 *   isOpen: boolean,
 *   openModal: () => void,
 *   closeModal: () => void,
 *   toggleModal: () => void
 * }} Un objet contenant l'état de la modale et les fonctions pour le manipuler.
 */
export const useModal = (initialState = false) => {
  /**
   * L'état booléen qui détermine si la modale est visible ou non.
   */
  const [isOpen, setIsOpen] = useState(initialState);

  /**
   * Ouvre la modale. Mémorisé avec `useCallback` pour la stabilité référentielle.
   */
  const openModal = useCallback(() => setIsOpen(true), []);

  /**
   * Ferme la modale. Mémorisé avec `useCallback`.
   */
  const closeModal = useCallback(() => setIsOpen(false), []);

  /**
   * Bascule l'état de la modale (ouvert -> fermé, fermé -> ouvert). Mémorisé avec `useCallback`.
   */
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
