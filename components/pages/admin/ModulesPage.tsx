import React, { useState } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { PuzzlePieceIcon } from '../../ui/icons';

type ModulePermissions = Record<string, boolean>;

interface Module {
    name: string;
    description: string;
    permissions: ModulePermissions;
}

const initialModules: Module[] = [
    { name: "Facturation Avancée", description: "Gestion des assurances et tiers-payants", permissions: { 'Hôpital S. Dolo': true, 'CSRéf Djenné': false, 'Cabinet Étoile': true } },
    { name: "Gestion de Laboratoire", description: "Intégration des résultats d'analyses", permissions: { 'Hôpital S. Dolo': true, 'CSRéf Djenné': true, 'Cabinet Étoile': false } },
    { name: "Prise de RDV en Ligne", description: "Permet aux patients de prendre RDV via un portail", permissions: { 'Hôpital S. Dolo': false, 'CSRéf Djenné': false, 'Cabinet Étoile': true } },
    { name: "Gestion de Pharmacie", description: "Suivi des stocks de médicaments", permissions: { 'Hôpital S. Dolo': true, 'CSRéf Djenné': true, 'Cabinet Étoile': false } },
];


const ModulesPage: React.FC = () => {
    const [modules, setModules] = useState<Module[]>(initialModules);

    const handleToggle = (moduleIndex: number, establishment: string, isEnabled: boolean) => {
        setModules(prevModules => {
            const newModules = [...prevModules];
            newModules[moduleIndex].permissions[establishment] = isEnabled;
            return newModules;
        });
    };

    const establishments = Object.keys(modules[0].permissions);
    const tableHeaders = ["Module", "Description", ...establishments];

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
