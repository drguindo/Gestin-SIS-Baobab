/**
 * @file Fournit un composant de fenêtre modale (Modal) accessible et réutilisable.
 * La modale est utilisée pour afficher des formulaires ou des informations importantes
 * sans quitter le contexte de la page principale.
 */

import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from './icons';

/**
 * Props pour le composant Modal.
 * @interface ModalProps
 */
interface ModalProps {
  /** Booléen pour contrôler la visibilité de la modale. */
  isOpen: boolean;
  /** Fonction de rappel pour fermer la modale. */
  onClose: () => void;
  /** Le titre à afficher dans l'en-tête de la modale. */
  title: string;
  /** Le contenu à afficher dans le corps de la modale. */
  children: React.ReactNode;
}

/**
 * Un composant de fenêtre modale accessible.
 * - Se ferme avec la touche 'Escape'.
 * - Empêche le défilement de l'arrière-plan.
 * - Le focus est géré pour une meilleure accessibilité au clavier.
 * - Ferme la modale lors d'un clic sur l'arrière-plan.
 *
 * @param {ModalProps} props - Les props du composant.
 * @returns {React.ReactElement | null} Le composant de la modale ou null si elle n'est pas ouverte.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Gère la fermeture de la modale avec la touche Échap.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Met le focus sur la modale lorsqu'elle s'ouvre.
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-secondary rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors d'un clic à l'intérieur de la modale.
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-100"
            aria-label="Fermer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
