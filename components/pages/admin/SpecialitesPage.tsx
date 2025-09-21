/**
 * @file Contient le composant de la page de gestion des spécialités médicales.
 * Permet aux administrateurs de lier des spécialités à des services existants.
 */

import React, { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import { StethoscopeIcon, PencilIcon, PlusIcon } from '../../ui/icons';
import SearchInput from '../../ui/SearchInput';
import { useModal } from '../../../hooks/useModal';
import type { User, Specialite } from '../../../types';
import { UserRole } from '../../../types';

/** Données simulées pour les spécialités. */
const initialData: Specialite[] = [
    { name: "Cardiologie", linkedService: "Cardiologie", establishment: "Hôpital Sominé Dolo" },
    { name: "Pédiatrie", linkedService: "Pédiatrie", establishment: "Hôpital Sominé Dolo" },
    { name: "Chirurgie Viscérale", linkedService: "Chirurgie Générale", establishment: "Hôpital Sominé Dolo" },
    { name: "Gynécologie-Obstétrique", linkedService: "Maternité", establishment: "Hôpital Sominé Dolo" },
    { name: "Endocrinologie", linkedService: "Médecine Interne", establishment: "Hôpital Sominé Dolo" },
    { name: "Consultation générale", linkedService: "Médecine Générale", establishment: "CSRéf de Djenné" },
];

const allEstablishments = [...new Set(initialData.map(s => s.establishment))];

/** Props pour le composant SpecialitesPage. */
interface SpecialitesPageProps {
  user: User;
}

/**
 * Page de gestion des spécialités médicales.
 * La logique de cette page est très similaire à celle de la page des services,
 * avec des vues et des filtres adaptés aux rôles des utilisateurs.
 *
 * @param {SpecialitesPageProps} props - Les props du composant.
 * @returns {React.ReactElement} La page de gestion des spécialités.
 */
const SpecialitesPage: React.FC<SpecialitesPageProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialites, setSpecialites] = useState<Specialite[]>(initialData);
    const { isOpen, openModal, closeModal } = useModal();
    
    // États pour les filtres
    const [establishmentFilter, setEstablishmentFilter] = useState(user.role === UserRole.SUPER_ADMIN ? 'all' : user.establishment);
    const [serviceFilter, setServiceFilter] = useState('all');

    /** Gère l'ajout d'une nouvelle spécialité. */
    const handleAddSpecialite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newSpecialite: Specialite = {
            name: formData.get('specialiteName') as string,
            linkedService: formData.get('serviceLink') as string,
            establishment: user.role === UserRole.SUPER_ADMIN ? (formData.get('establishment') as string) : user.establishment,
        };
        setSpecialites(prev => [...prev, newSpecialite]);
        closeModal();
    };

    /** Données visibles par l'utilisateur en fonction de son rôle et des filtres. */
    const userVisibleData = useMemo(() => {
        if (user.role === UserRole.SUPER_ADMIN) {
            if (establishmentFilter === 'all') return specialites;
            return specialites.filter(s => s.establishment === establishmentFilter);
        }
        return specialites.filter(s => s.establishment === user.establishment);
    }, [user, specialites, establishmentFilter]);
    
    const uniqueServices = useMemo(() => [...new Set(userVisibleData.map(s => s.linkedService))], [userVisibleData]);

    /** Données finales filtrées pour l'affichage. */
    const filteredData = useMemo(() => {
        return userVisibleData.filter(spec =>
            (spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             spec.linkedService.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (serviceFilter === 'all' || spec.linkedService === serviceFilter)
        );
    }, [searchTerm, serviceFilter, userVisibleData]);

    /** En-têtes de tableau conditionnels au rôle. */
    const tableHeaders = user.role === UserRole.SUPER_ADMIN
        ? ["Nom de la Spécialité", "Service rattaché", "Établissement", "Actions"]
        : ["Nom de la Spécialité", "Service rattaché", "Actions"];

    /** Données de tableau formatées. */
    const tableData = filteredData.map(spec => {
        const row: (string | React.ReactNode)[] = [
            spec.name,
            spec.linkedService,
        ];
        if (user.role === UserRole.SUPER_ADMIN) {
            row.push(spec.establishment);
        }
        row.push(
            <button onClick={openModal} className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md transition-colors duration-200">
                <PencilIcon className="w-5 h-5" />
            </button>
        );
        return row;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Spécialités</h2>
                <button onClick={openModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter une spécialité
                </button>
            </div>
            
            <Card>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {user.role === UserRole.SUPER_ADMIN ? "Liste de toutes les spécialités" : `Spécialités de ${user.establishment}`}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {user.role === UserRole.SUPER_ADMIN && (
                            <div className="flex-grow">
                                <label htmlFor="establishment-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Établissement</label>
                                <select id="establishment-filter" value={establishmentFilter} onChange={e => setEstablishmentFilter(e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    <option value="all">Tous les établissements</option>
                                    {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        )}
                        {user.role === UserRole.ADMIN_LOCAL && (
                             <div className="flex-grow">
                                <label htmlFor="service-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
                                <select id="service-filter" value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    <option value="all">Tous les services</option>
                                    {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex-grow">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                            <SearchInput 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par spécialité..."
                            />
                        </div>
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

             <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter une Spécialité">
                <form onSubmit={handleAddSpecialite} className="space-y-4">
                    <div>
                        <label htmlFor="specialiteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la spécialité</label>
                        <input type="text" id="specialiteName" name="specialiteName" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="serviceLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service rattaché</label>
                        <select id="serviceLink" name="serviceLink" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option>Chirurgie Générale</option>
                            <option>Pédiatrie</option>
                            <option>Maternité</option>
                            <option>Médecine Interne</option>
                            <option>Cardiologie</option>
                        </select>
                    </div>
                     {user.role === UserRole.SUPER_ADMIN && (
                         <div>
                            <label htmlFor="establishment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Établissement</label>
                            <select id="establishment" name="establishment" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                         </div>
                     )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <StethoscopeIcon className="w-5 h-5 mr-2" />
                            Ajouter la spécialité
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SpecialitesPage;
