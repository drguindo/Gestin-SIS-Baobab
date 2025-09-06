
import React, { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import Badge from '../../ui/Badge';
import Modal from '../../ui/Modal';
import { PencilIcon, BuildingStorefrontIcon, PlusIcon } from '../../ui/icons';
import SearchInput from '../../ui/SearchInput';
import { useModal } from '../../../hooks/useModal';
import type { User } from '../../../types';
import { UserRole } from '../../../types';

type Etablissement = {
    name: string;
    type: string;
    location: string;
    status: 'Actif' | 'Inactif';
};

const initialData: Etablissement[] = [
    { name: "Hôpital Sominé Dolo", type: "Hôpital Régional", location: "Mopti", status: "Actif" },
    { name: "CSRéf de Djenné", type: "Centre de Référence", location: "Djenné", status: "Actif" },
    { name: "CSCOM de Sangha", type: "Centre Communautaire", location: "Sangha", status: "Actif" },
    { name: "Cabinet Médical Étoile", type: "Cabinet Privé", location: "Sévaré", status: "Actif" },
    { name: "Cabinet Médical Nando", type: "Cabinet Privé", location: "Mopti", status: "Actif" },
    { name: "Hôpital de Gao", type: "Hôpital Régional", location: "Gao", status: "Inactif" },
];

interface EtablissementsPageProps {
  user: User;
}

const EtablissementsPage: React.FC<EtablissementsPageProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [etablissements, setEtablissements] = useState<Etablissement[]>(initialData);
    const { isOpen, openModal, closeModal } = useModal();

    const handleAddEtablissement = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newEtablissement: Etablissement = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            location: formData.get('location') as string,
            status: 'Actif', // Default status
        };
        setEtablissements(prev => [...prev, newEtablissement]);
        closeModal();
    };
    
    const userVisibleData = useMemo(() => {
        if (user.role === UserRole.SUPER_ADMIN) {
            return etablissements;
        }
        return etablissements.filter(etab => etab.name === user.establishment);
    }, [user, etablissements]);


    const tableHeaders = ["Nom de l'établissement", "Type", "Localisation", "Statut", "Actions"];

    const filteredData = useMemo(() => {
        if (!searchTerm) return userVisibleData;
        return userVisibleData.filter(etab =>
            etab.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, userVisibleData]);

    const tableData = filteredData.map((etab, index) => [
        etab.name,
        etab.type,
        etab.location,
        <Badge color={etab.status === 'Actif' ? 'green' : 'red'} text={etab.status} />,
        <button onClick={openModal} className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md transition-colors duration-200">
            <PencilIcon className="w-5 h-5" />
        </button>
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Établissements</h2>
                {user.role === UserRole.SUPER_ADMIN && (
                    <button onClick={openModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Ajouter un établissement
                    </button>
                )}
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Liste des établissements sanitaires</h3>
                    <SearchInput 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par nom..."
                    />
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter un Établissement">
                <form onSubmit={handleAddEtablissement} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'établissement</label>
                        <input type="text" id="name" name="name" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <input type="text" id="type" name="type" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Localisation</label>
                        <input type="text" id="location" name="location" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">Enregistrer</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EtablissementsPage;