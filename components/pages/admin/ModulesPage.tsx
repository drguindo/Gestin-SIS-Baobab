/**
 * @file Contient le composant de la page de gestion des modules.
 * Permet aux Super Admins d'activer ou de désactiver des fonctionnalités
 * spécifiques (modules) pour chaque établissement.
 */

import React, { useState } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { PuzzlePieceIcon } from '../../ui/icons';

/** Type pour les permissions d'un module, associant un nom d'établissement à un booléen. */
type ModulePermissions = Record<string, boolean>;

/** Interface définissant la structure d'un module. */
interface Module {
    name: string;
    description: string;
    permissions: ModulePermissions;
}

/** Données simulées pour les modules et leurs états d'activation par établissement. */
const initialModules: Module[] = [
    { 
        name: "Facturation Avancée", 
        description: "Gestion des assurances et tiers-payants", 
        permissions: { 
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': false, 
            'CSCOM de Sangha': false,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        } 
    },
    { 
        name: "Gestion de Laboratoire", 
        description: "Intégration des résultats d'analyses", 
        permissions: { 
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': false,
            'Cabinet Médical Étoile': false,
            'Cabinet Médical Nando': false
        } 
    },
    { 
        name: "Prise de RDV en Ligne", 
        description: "Permet aux patients de prendre RDV via un portail", 
        permissions: { 
            'Hôpital Sominé Dolo': false, 
            'CSRéf de Djenné': false, 
            'CSCOM de Sangha': false,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        } 
    },
    { 
        name: "Gestion de Pharmacie", 
        description: "Suivi des stocks de médicaments", 
        permissions: { 
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': true,
            'Cabinet Médical Étoile': false,
            'Cabinet Médical Nando': false
        } 
    },
    {
        name: "Gestion des Référencements",
        description: "Coordination des transferts de patients",
        permissions: {
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': true,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        }
    },
    {
        name: "Surveillance Épidémiologique",
        description: "Déclaration des maladies à déclaration obligatoire",
        permissions: {
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': true,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        }
    },
    {
        name: "Surveillance RAM",
        description: "Suivi de la Résistance aux Antimicrobiens",
        permissions: {
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': true,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        }
    },
    {
        name: "Gestion des Campagnes",
        description: "Planification et suivi des campagnes de santé",
        permissions: {
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': true,
            'Cabinet Médical Étoile': true,
            'Cabinet Médical Nando': true
        }
    },
     {
        name: "Gestion des Ressources",
        description: "Suivi des lits et des équipements médicaux",
        permissions: {
            'Hôpital Sominé Dolo': true, 
            'CSRéf de Djenné': true, 
            'CSCOM de Sangha': false,
            'Cabinet Médical Étoile': false,
            'Cabinet Médical Nando': false
        }
    }
];

/**
 * Page de gestion des modules.
 * Affiche une matrice de permissions sous forme de tableau, où chaque ligne est un module
 * et chaque colonne (après les descriptions) est un établissement.
 * L'état d'activation de chaque module pour chaque établissement peut être basculé
 * à l'aide d'un composant ToggleSwitch.
 *
 * @returns {React.ReactElement} La page de gestion des modules.
 */
const ModulesPage: React.FC = () => {
    const [modules, setModules] = useState<Module[]>(initialModules);

    /**
     * Gère le changement d'état d'un module pour un établissement donné.
     * @param {number} moduleIndex - L'index du module dans le tableau `modules`.
     * @param {string} establishment - Le nom de l'établissement concerné.
     * @param {boolean} isEnabled - Le nouvel état d'activation.
     */
    const handleToggle = (moduleIndex: number, establishment: string, isEnabled: boolean) => {
        setModules(prevModules => {
            const newModules = [...prevModules];
            newModules[moduleIndex].permissions[establishment] = isEnabled;
            return newModules;
        });
    };

    /** Liste des établissements extraite des données du premier module. */
    const establishments = Object.keys(modules[0].permissions);
    
    /** Formatage des noms d'établissements pour les en-têtes de tableau. */
    const establishmentHeaders = establishments.map(name => {
        return name
            .replace("Hôpital Sominé Dolo", "HÔPITAL S. DOLO")
            .replace("CSRéf de Djenné", "CSRÉF DJENNÉ")
            .replace("CSCOM de Sangha", "CSCOM SANGHA")
            .replace("Cabinet Médical Étoile", "CABINET ÉTOILE")
            .replace("Cabinet Médical Nando", "CABINET NANDO");
    });

    /** En-têtes pour le tableau, incluant les noms formatés des établissements. */
    const tableHeaders = ["Module", "Description", ...establishmentHeaders];

    /** Données formatées pour le composant Table. */
    const tableData = modules.map((module, moduleIndex) => [
        module.name,
        module.description,
        ...establishments.map(establishment => (
            <ToggleSwitch 
                key={establishment}
                enabled={module.permissions[establishment]} 
                onChange={(isEnabled) => handleToggle(moduleIndex, establishment, isEnabled)}
            />
        ))
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Modules</h2>
            </div>

            <Card>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Activation des modules optionnels</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activez ou désactivez des fonctionnalités pour chaque établissement.</p>
                    </div>
                    <button 
                        onClick={() => alert("Simulation de la gestion des modules.")}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        <PuzzlePieceIcon className="w-5 h-5 mr-2" />
                        Gérer les modules
                    </button>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>
        </div>
    );
};

export default ModulesPage;
