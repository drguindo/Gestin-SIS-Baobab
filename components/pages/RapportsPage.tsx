/**
 * @file Contient le composant de la page de génération de rapports.
 * Actuellement, cette page est une maquette fonctionnelle qui simule
 * la configuration et la génération de rapports.
 */

import React from 'react';
import Card from '../ui/Card';
import { DownloadIcon } from '../ui/icons';

/**
 * La page de génération de rapports.
 * Permet à l'utilisateur de sélectionner le type de rapport et une plage de dates.
 * La génération du rapport est simulée par une alerte.
 *
 * @returns {React.ReactElement} La page de génération de rapports.
 */
const RapportsPage: React.FC = () => {
  /**
   * Simule la génération et le téléchargement d'un rapport.
   * @param {React.MouseEvent<HTMLButtonElement>} e - L'événement de clic.
   */
  const handleGenerateReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("Génération du rapport simulée. Le téléchargement commencerait maintenant.");
  };

  return (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Génération de Rapports</h2>

        <Card>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Configurer votre rapport</h3>
            <form className="space-y-6">
                <div>
                    <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type de rapport
                    </label>
                    <select
                        id="reportType"
                        name="reportType"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        defaultValue="Activité Mensuel"
                    >
                        <option>Rapport d'activité mensuel</option>
                        <option>Rapport de surveillance épidémiologique</option>
                        <option>Rapport financier</option>
                        <option>Rapport sur les ressources</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date de début
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        onClick={handleGenerateReport}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Générer et Télécharger le Rapport
                    </button>
                </div>
            </form>
        </Card>
        
        <div className="mt-8 p-6 bg-gray-50 dark:bg-secondary rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">L'aperçu du rapport généré apparaîtra ici.</p>
        </div>
    </div>
  );
};

export default RapportsPage;
