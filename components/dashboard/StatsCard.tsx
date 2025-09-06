/**
 * @file Contient un composant réutilisable pour afficher une statistique clé
 * sous forme de carte avec un titre, une valeur et une icône.
 */

import React from 'react';
import Card from '../ui/Card';

/**
 * Props pour le composant StatsCard.
 * @interface StatsCardProps
 */
interface StatsCardProps {
  /** Le titre de la statistique (par ex., "Total Patients"). */
  title: string;
  /** La valeur de la statistique à afficher. */
  value: string | number;
  /** L'élément icône ReactNode à afficher. */
  icon: React.ReactNode;
  /** La classe de couleur Tailwind CSS pour l'icône et son arrière-plan (par ex., "text-blue-500"). */
  color: string;
}

/**
 * Affiche une carte de statistique individuelle pour le tableau de bord.
 * Ce composant est conçu pour être visuellement impactant et fournir
 * des indicateurs de performance clés (KPI) en un coup d'œil.
 *
 * @param {StatsCardProps} props - Les props du composant.
 * @returns {React.ReactElement} Une carte de statistique.
 */
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            <div className={color}>{icon}</div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
