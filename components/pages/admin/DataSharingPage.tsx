/**
 * @file Contient le composant de la page de gestion du partage de données.
 * Cette page permet aux Admin Locaux de configurer les permissions de partage de données
 * de leur établissement avec d'autres.
 */

import React, { useState } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { ShareIcon, DocumentDuplicateIcon } from '../../ui/icons';

/** Type pour les permissions de partage de données d'un établissement. */
type Permissions = {
    patientRecords: boolean;
    epidemiology: boolean;
    statistics: boolean;
};

/** Type pour l'ensemble des permissions de tous les établissements. */
type EstablishmentPermissions = Record<string, Permissions>;

/** Données simulées pour les permissions de partage initiales. */
const initialPermissions: EstablishmentPermissions = {
    'CSRéf de Djenné': { patientRecords: true, epidemiology: true, statistics: false },
    'CSCOM de Sangha': { patientRecords: false, epidemiology: true, statistics: false },
    'Cabinet Médical Étoile': { patientRecords: false, epidemiology: false, statistics: false },
    'Cabinet Médical Nando': { patientRecords: false, epidemiology: false, statistics: false },
};

/**
 * Page de gestion du partage de données.
 * Permet de définir quelles données (dossiers patients, épidémiologie, statistiques)
 * l'établissement de l'Admin Local partage avec d'autres établissements.
 * Inclut également une fonctionnalité de synchronisation pour copier les permissions
 * d'un établissement à un autre.
 *
 * @returns {React.ReactElement} La page de gestion du partage de données.
 */
const DataSharingPage: React.FC = () => {
    const [permissions, setPermissions] = useState<EstablishmentPermissions>(initialPermissions);
    const [sourceEstablishment, setSourceEstablishment] = useState<string>('');
    const [targetEstablishments, setTargetEstablishments] = useState<Set<string>>(new Set());

    /**
     * Met à jour une permission spécifique pour un établissement.
     * @param {string} establishment - L'établissement dont la permission change.
     * @param {keyof Permissions} key - Le type de permission à changer.
     * @param {boolean} value - La nouvelle valeur de la permission.
     */
    const handlePermissionChange = (establishment: string, key: keyof Permissions, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [establishment]: {
                ...prev[establishment],
                [key]: value,
            },
        }));
    };

    /** Gère la sélection des établissements cibles pour la synchronisation. */
    const handleTargetChange = (establishment: string) => {
        setTargetEstablishments(prev => {
            const newTargets = new Set(prev);
            if (newTargets.has(establishment)) {
                newTargets.delete(establishment);
            } else {
                newTargets.add(establishment);
            }
            return newTargets;
        });
    };

    /** Synchronise les permissions de l'établissement source vers les cibles. */
    const handleSync = () => {
        if (!sourceEstablishment || targetEstablishments.size === 0) return;

        const sourcePerms = permissions[sourceEstablishment];
        
        setPermissions(prev => {
            const newPerms = { ...prev };
            targetEstablishments.forEach(target => {
                newPerms[target] = { ...sourcePerms };
            });
            return newPerms;
        });

        alert(`Permissions synchronisées depuis ${sourceEstablishment} vers ${Array.from(targetEstablishments).join(', ')}.`);
        // Réinitialise les sélections après la synchronisation.
        setSourceEstablishment('');
        setTargetEstablishments(new Set());
    };

    /** Simule la sauvegarde des permissions. */
    const handleSave = () => {
        alert('Permissions sauvegardées avec succès (simulation).');
    }

    const tableHeaders = ["Établissement", "Accès Dossiers Patients", "Accès Données Épidémio.", "Accès Statistiques"];
    
    const tableData = Object.entries(permissions).map(([establishment, perms]) => [
        establishment,
        <ToggleSwitch enabled={perms.patientRecords} onChange={(e) => handlePermissionChange(establishment, 'patientRecords', e)} />,
        <ToggleSwitch enabled={perms.epidemiology} onChange={(e) => handlePermissionChange(establishment, 'epidemiology', e)} />,
        <ToggleSwitch enabled={perms.statistics} onChange={(e) => handlePermissionChange(establishment, 'statistics', e)} />,
    ]);

    const establishmentList = Object.keys(permissions);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion du Partage de Données</h2>
            
            <Card className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Synchronisation des Permissions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Copiez rapidement les permissions d'un établissement source vers un ou plusieurs établissements cibles.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label htmlFor="source-est" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            1. Sélectionnez l'établissement source
                        </label>
                        <select
                            id="source-est"
                            value={sourceEstablishment}
                            onChange={(e) => {
                                setSourceEstablishment(e.target.value);
                                setTargetEstablishments(new Set()); // Reset targets when source changes
                            }}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value="">-- Choisir une source --</option>
                            {establishmentList.map(est => <option key={est} value={est}>{est}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            2. Sélectionnez le(s) cible(s)
                        </label>
                        <div className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md max-h-36 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900/50">
                            {establishmentList
                                .filter(est => est !== sourceEstablishment)
                                .map(est => (
                                    <div key={est} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`target-${est.replace(/\s/g, '-')}`}
                                            name="targetEstablishments"
                                            checked={targetEstablishments.has(est)}
                                            onChange={() => handleTargetChange(est)}
                                            disabled={!sourceEstablishment}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500 rounded disabled:opacity-50"
                                        />
                                        <label htmlFor={`target-${est.replace(/\s/g, '-')}`} className={`ml-3 block text-sm ${!sourceEstablishment ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {est}
                                        </label>
                                    </div>
                                ))
                            }
                            {!sourceEstablishment && <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Veuillez d'abord choisir une source.</p>}
                            {sourceEstablishment && establishmentList.filter(est => est !== sourceEstablishment).length === 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Aucune autre cible disponible.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSync}
                        disabled={!sourceEstablishment || targetEstablishments.size === 0}
                        className="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                    >
                        <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                        Synchroniser les permissions
                    </button>
                </div>
            </Card>

            <Card>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Permissions d'accès pour l'Hôpital Sominé Dolo</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Autoriser d'autres établissements à accéder à certaines de vos données pour la continuité des soins et les statistiques.
                    </p>
                </div>

                <Table headers={tableHeaders} data={tableData} />

                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                        <ShareIcon className="w-5 h-5 mr-2" />
                        Sauvegarder les permissions
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default DataSharingPage;
