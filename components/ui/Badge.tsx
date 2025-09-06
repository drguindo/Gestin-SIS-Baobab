/**
 * @file Fournit un composant de badge coloré pour afficher des statuts ou des tags.
 */

import React from 'react';

/**
 * Props pour le composant Badge.
 * @interface BadgeProps
 */
interface BadgeProps {
  /** Le texte à afficher dans le badge. */
  text: string;
  /** Le nom de la couleur pour le style du badge. */
  color: 'green' | 'yellow' | 'red' | 'blue';
}

/**
 * Mappe les noms de couleurs à des classes Tailwind CSS spécifiques
 * pour le fond et la couleur du texte, en supportant le mode sombre.
 */
const colorClasses = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

/**
 * Un petit composant d'UI pour afficher des informations de statut
 * de manière visuellement distincte (par ex., "Actif", "En observation").
 *
 * @param {BadgeProps} props - Les props du composant.
 * @returns {React.ReactElement} Un élément span stylisé comme un badge.
 */
const Badge: React.FC<BadgeProps> = ({ text, color }) => {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[color]}`}>
      {text}
    </span>
  );
};

export default Badge;
