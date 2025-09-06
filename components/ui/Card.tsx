/**
 * @file Fournit un composant de carte (Card) réutilisable pour encapsuler
 * du contenu avec un style cohérent (fond, ombre, coins arrondis).
 */

import React from 'react';

/**
 * Props pour le composant Card.
 * @interface CardProps
 */
interface CardProps {
  /** Le contenu à afficher à l'intérieur de la carte. */
  children: React.ReactNode;
  /** Classes CSS supplémentaires pour personnaliser la carte. */
  className?: string;
}

/**
 * Le composant Card est un conteneur de base utilisé dans toute l'application
 * pour regrouper des informations ou des contrôles d'interface utilisateur
 * dans un bloc visuellement distinct.
 *
 * @param {CardProps} props - Les props du composant.
 * @returns {React.ReactElement} Un conteneur de carte stylisé.
 */
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-secondary rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
