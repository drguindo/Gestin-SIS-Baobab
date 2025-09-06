
import React, { useMemo } from 'react';
import type { User, StatsData, ConsultationDataPoint, EpidemiologyDataPoint } from '../../types';
import StatsCard from './StatsCard';
import ConsultationsChart from './ConsultationsChart';
import EpidemiologyChart from './EpidemiologyChart';
import { UsersIcon, DocumentCheckIcon, BuildingOfficeIcon, ChartBarIcon } from '../ui/icons';

interface DashboardPageProps {
  user: User;
}

// Mock data generation
const generateStats = (seed: number): StatsData => ({
  totalPatients: 1500 + seed * 100,
  consultationsToday: 45 + seed * 5,
  activeHospitalizations: 80 + seed * 10,
  occupancyRate: 75 + seed,
});

const generateConsultations = (): ConsultationDataPoint[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      count: Math.floor(Math.random() * 50) + 20,
    };
  });
};

const generateEpidemiology = (): EpidemiologyDataPoint[] => ([
    { name: 'Paludisme', value: 400 },
    { name: 'IRA', value: 300 },
    { name: 'Diarrhée', value: 220 },
    { name: 'Fièvre Typhoïde', value: 150 },
    { name: 'Autres', value: 180 },
]);


const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const dashboardData = useMemo(() => {
    const seed = user.id; // Use user ID to generate slightly different data
    return {
      stats: generateStats(seed),
      consultations: generateConsultations(),
      epidemiology: generateEpidemiology(),
    };
  }, [user.id]);
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tableau de bord</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
            title="Total Patients" 
            value={dashboardData.stats.totalPatients.toLocaleString('fr-FR')} 
            icon={<UsersIcon className="w-8 h-8"/>}
            color="text-blue-500"
        />
        <StatsCard 
            title="Consultations (jour)" 
            value={dashboardData.stats.consultationsToday.toLocaleString('fr-FR')}
            icon={<DocumentCheckIcon className="w-8 h-8"/>}
            color="text-green-500"
        />
        <StatsCard 
            title="Hospitalisations Actives" 
            value={dashboardData.stats.activeHospitalizations.toLocaleString('fr-FR')}
            icon={<BuildingOfficeIcon className="w-8 h-8"/>}
            color="text-yellow-500"
        />
        <StatsCard 
            title="Taux d'occupation" 
            value={`${dashboardData.stats.occupancyRate}%`}
            icon={<ChartBarIcon className="w-8 h-8"/>}
            color="text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ConsultationsChart data={dashboardData.consultations} />
        </div>
        <div className="lg:col-span-2">
            <EpidemiologyChart data={dashboardData.epidemiology} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
