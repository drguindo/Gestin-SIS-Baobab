
import React from 'react';
import Card from '../ui/Card';
import { ArrowTrendingUpIcon } from '../ui/icons';

const ReferencementsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion des Référencements</h2>
      <Card>
        <div className="text-center py-12">
          <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Module en construction</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            La page de gestion des référencements sera bientôt disponible.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ReferencementsPage;
