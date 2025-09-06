/**
 * @file Contient le composant de la page principale du tableau de bord.
 * Il affiche des statistiques clés et des visualisations de données.
 */

import React, { useMemo, useState, useEffect } from 'react';
import type { User, StatsData, ConsultationDataPoint, EpidemiologyDataPoint } from '../../types';
import StatsCard from './StatsCard';
import ConsultationsChart from './ConsultationsChart';
import EpidemiologyChart from './EpidemiologyChart';
import { UsersIcon, DocumentCheckIcon, BuildingOfficeIcon, ChartBarIcon } from '../ui/icons';

/**
 * Props pour le composant DashboardPage.
 * @interface DashboardPageProps
 */
interface DashboardPageProps {
  /** L'objet utilisateur actuellement connecté. */
  user: User;
}

// NOTE: Les fonctions de génération de données ci-dessous sont des simulations.
// Dans une application de production, ces données seraient récupérées via des appels API.

/**
 * Génère des données statistiques simulées.
 * @param {number} seed - Une valeur pour varier légèrement les données (par ex., l'ID de l'utilisateur).
 * @returns {StatsData} Un objet de données statistiques.
 */
const generateStats = (seed: number): StatsData => ({
  totalPatients: 1500 + seed * 100 + Math.floor(Math.random() * 20 - 10),
  consultationsToday: 45 + seed * 5 + Math.floor(Math.random() * 10 - 5),
  activeHospitalizations: 80 + seed * 10 + Math.floor(Math.random() * 6 - 3),
  occupancyRate: 75 + seed + Math.floor(Math.random() * 4 - 2),
});

/**
 * Génère des données de consultation simulées pour les 7 derniers jours.
 * @returns {ConsultationDataPoint[]} Un tableau de points de données.
 */
const generateConsultations = (): ConsultationDataPoint[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleString('fr-FR', { weekday: 'short' }),
      count: Math.floor(Math.random() * 50) + 20,
    };
  });
};

/**
 * Génère des données de répartition épidémiologique simulées.
 * @returns {EpidemiologyDataPoint[]} Un tableau de points de données pour le diagramme circulaire.
 */
const generateEpidemiology = (): EpidemiologyDataPoint[] => ([
    { name: 'Paludisme', value: 400 },
    { name: 'IRA', value: 300 },
    { name: 'Diarrhée', value: 220 },
    { name: 'Fièvre Typhoïde', value: 150 },
    { name: 'Autres', value: 180 },
]);


/**
 * La page du tableau de bord principal qui sert de page d'accueil après la connexion.
 * Elle affiche une vue d'ensemble de l'activité de l'établissement à travers
 * des cartes de statistiques et des graphiques.
 * Les données sont générées de manière aléatoire et mémorisées avec `useMemo` pour
 * éviter de les recalculer à chaque rendu, en se basant sur l'ID de l'utilisateur
 * pour assurer une légère variation entre les profils.
 *
 * @param {DashboardPageProps} props - Les props du composant.
 * @returns {React.ReactElement} La page du tableau de bord.
 */
const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [stats, setStats] = useState(() => generateStats(user.id));

  // Simulation du Polling : mise à jour des stats toutes les 5 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStats(generateStats(user.id));
    }, 5000); // 5000 ms = 5 secondes

    return () => clearInterval(intervalId); // Nettoyage à la destruction du composant
  }, [user.id]);

  const chartData = useMemo(() => {
    return {
      consultations: generateConsultations(),
      epidemiology: generateEpidemiology(),
    };
  }, []);
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tableau de bord</h2>
      
      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
            title="Total Patients" 
            value={stats.totalPatients.toLocaleString('fr-FR')} 
            icon={<UsersIcon className="w-8 h-8"/>}
            color="text-blue-500"
        />
        <StatsCard 
            title="Consultations (jour)" 
            value={stats.consultationsToday.toLocaleString('fr-FR')}
            icon={<DocumentCheckIcon className="w-8 h-8"/>}
            color="text-green-500"
        />
        <StatsCard 
            title="Hospitalisations Actives" 
            value={stats.activeHospitalizations.toLocaleString('fr-FR')}
            icon={<BuildingOfficeIcon className="w-8 h-8"/>}
            color="text-yellow-500"
        />
        <StatsCard 
            title="Taux d'occupation" 
            value={`${stats.occupancyRate}%`}
            icon={<ChartBarIcon className="w-8 h-8"/>}
            color="text-red-500"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ConsultationsChart data={chartData.consultations} />
        </div>
        <div className="lg:col-span-2">
            <EpidemiologyChart data={chartData.epidemiology} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;