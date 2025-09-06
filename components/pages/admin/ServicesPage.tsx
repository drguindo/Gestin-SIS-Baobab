/**
 * @file Contient le composant de la page de gestion des services médicaux.
 * Permet aux administrateurs de gérer les services (ex: Pédiatrie) au sein des établissements.
 */

import React, { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import Modal from '../../ui/Modal';
import { CogIcon, PencilIcon, PlusIcon } from '../../ui/icons';
import SearchInput from '../../ui/SearchInput';
import { useModal } from '../../../hooks/useModal';
import type { User, Service } from '../../../types';
import { UserRole } from '../../../types';

/** Données simulées pour les services médicaux. */
const initialData: Service[] = [
    { name: "Chirurgie Générale", head: "Dr. Bamba", capacity: 30, unit: "Bloc Opératoire", establishment: "Hôpital Sominé Dolo" },
    { name: "Pédiatrie", head: "Dr. Touré", capacity: 20, unit: "Hospitalisation Pédiatrique", establishment: "Hôpital Sominé Dolo" },
    { name: "Maternité", head: "Dr. Cissé", capacity: 15, unit: "Salle d'accouchement", establishment: "Hôpital Sominé Dolo" },
    { name: "Médecine Interne", head: "Dr. Fofana", capacity: 40, unit: "Unité de Soins Continus", establishment: "Hôpital Sominé Dolo" },
    { name: "Cardiologie", head: "Dr. Sangaré", capacity: 15, unit: "Soins Intensifs Cardiologiques", establishment: "Hôpital Sominé Dolo" },
    { name: "Médecine Générale", head: "Dr. Diarra", capacity: 10, unit: "Consultations Externes", establishment: "CSRéf de Djenné" },
    { name: "Soins Primaires", head: "Inf. Coulibaly", capacity: 5, unit: "Infirmerie", establishment: "CSCOM de Sangha" },
];

const allEstablishments = [...new Set(initialData.map(s => s.establishment))];

/** Props pour le composant ServicesPage. */
interface ServicesPageProps {
  user: User;
}

/**
 * Page de gestion des services.
 * Implémente une logique de filtrage et d'affichage basée sur le rôle de l'utilisateur.
 * - Super Admin : Voit tous les services et peut filtrer par établissement.
 * - Admin Local : Voit uniquement les services de son établissement et peut filtrer par unité.
 *
 * @param {ServicesPageProps} props - Les props du composant.
 * @returns {React.ReactElement} La page de gestion des services.
 */
const ServicesPage: React.FC<ServicesPageProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState<Service[]>(initialData);
    const { isOpen, openModal, closeModal } = useModal();

    // États pour les filtres.
    const [establishmentFilter, setEstablishmentFilter] = useState(user.role === UserRole.SUPER_ADMIN ? 'all' : user.establishment);
    const [unitFilter, setUnitFilter] = useState('all');

    /** Gère l'ajout d'un nouveau service via le formulaire modal. */
    const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newService: Service = {
            name: formData.get('serviceName') as string,
            head: formData.get('chefService') as string,
            capacity: Number(formData.get('capacity')),
            unit: formData.get('unit') as string,
            establishment: user.role === UserRole.SUPER_ADMIN ? (formData.get('establishment') as string) : user.establishment
        };
        setServices(prev => [...prev, newService]);
        closeModal();
    };

    /** Détermine les données de base visibles en fonction du rôle et du filtre d'établissement. */
    const userVisibleData = useMemo(() => {
        if (user.role === UserRole.SUPER_ADMIN) {
            if (establishmentFilter === 'all') return services;
            return services.filter(s => s.establishment === establishmentFilter);
        }
        return services.filter(s => s.establishment === user.establishment);
    }, [user, services, establishmentFilter]);
    
    /** Calcule les unités uniques pour le filtre de l'Admin Local. */
    const uniqueUnits = useMemo(() => [...new Set(userVisibleData.map(s => s.unit))], [userVisibleData]);

    /** Filtre les données visibles en fonction de la recherche et du filtre d'unité. */
    const filteredData = useMemo(() => {
        return userVisibleData.filter(service =>
            (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             service.head.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (unitFilter === 'all' || service.unit === unitFilter)
        );
    }, [searchTerm, unitFilter, userVisibleData]);

    /** Définit les en-têtes de tableau en fonction du rôle de l'utilisateur. */
    const tableHeaders = user.role === UserRole.SUPER_ADMIN 
        ? ["Nom du Service", "Chef de Service", "Unité", "Capacité (Lits)", "Établissement", "Actions"]
        : ["Nom du Service", "Chef de Service", "Unité", "Capacité (Lits)", "Actions"];

    /** Formate les données pour l'affichage dans le tableau. */
    const tableData = filteredData.map(service => {
        const commonData: (string | number | React.ReactNode)[] = [
            service.name,
            service.head,
            service.unit,
            service.capacity,
        ];
        if (user.role === UserRole.SUPER_ADMIN) {
            commonData.push(service.establishment);
        }
        commonData.push(
            <button onClick={openModal} className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md transition-colors duration-200">
                <PencilIcon className="w-5 h-5" />
            </button>
        );
        return commonData;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Services</h2>
                <button onClick={openModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter un service
                </button>
            </div>
            
            <Card>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {user.role === UserRole.SUPER_ADMIN ? "Liste de tous les services" : `Services de ${user.establishment}`}
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
                                <label htmlFor="unit-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Unité</label>
                                <select id="unit-filter" value={unitFilter} onChange={e => setUnitFilter(e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    <option value="all">Toutes les unités</option>
                                    {uniqueUnits.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex-grow">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                            <SearchInput 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par service..."
                            />
                        </div>
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter un Service">
                 <form onSubmit={handleAddService} className="space-y-4">
                    <div>
                        <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom du service</label>
                        <input type="text" id="serviceName" name="serviceName" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="chefService" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chef de service</label>
                        <input type="text" id="chefService" name="chefService" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unité</label>
                        <input type="text" id="unit" name="unit" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacité (lits)</label>
                        <input type="number" id="capacity" name="capacity" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
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
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <CogIcon className="w-5 h-5 mr-2 inline-block" />
                            Ajouter le service
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServicesPage;
