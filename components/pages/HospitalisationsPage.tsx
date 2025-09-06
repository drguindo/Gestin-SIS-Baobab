/**
 * @file Contient le composant de la page de gestion des hospitalisations.
 * Ce composant affiche des vues différentes et des fonctionnalités basées sur le rôle
 * de l'utilisateur (vue de supervision pour les administrateurs, vue de gestion pour le personnel de l'établissement).
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { User, Hospitalisation } from '../../types';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon, BedIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';
import Badge from '../ui/Badge';

/** Données simulées pour les hospitalisations. */
const mockHospitalisations: Hospitalisation[] = [
    // Hôpital Sominé Dolo
    { id: 'H001', patientId: 'P001', patientName: 'Moussa Traoré', admissionDate: '2024-07-15', service: 'Chirurgie Générale', status: 'En observation', diagnosis: 'Post-opératoire Appendicectomie', establishment: 'Hôpital Sominé Dolo' },
    { id: 'H002', patientId: 'P002', patientName: 'Awa Diarra', admissionDate: '2024-07-18', service: 'Pédiatrie', status: 'Stable', diagnosis: 'Paludisme sévère', establishment: 'Hôpital Sominé Dolo' },
    { id: 'H003', patientId: 'P004', patientName: 'Fatoumata Kéita', admissionDate: '2024-07-20', service: 'Maternité', status: 'Stable', diagnosis: 'Accouchement', establishment: 'Hôpital Sominé Dolo', dischargeDate: '2024-07-23' },
    { id: 'H004', patientId: 'P005', patientName: 'Ibrahim Diallo', admissionDate: '2024-07-12', service: 'Cardiologie', status: 'Critique', diagnosis: 'Infarctus du myocarde', establishment: 'Hôpital Sominé Dolo' },

    // CSRéf de Djenné
    { id: 'H005', patientId: 'P007', patientName: 'Sékou Diallo', admissionDate: '2024-07-19', service: 'Médecine Générale', status: 'Stable', diagnosis: 'Fièvre Typhoïde compliquée', establishment: 'CSRéf de Djenné' },
    { id: 'H006', patientId: 'P018', patientName: 'Salimata Traoré', admissionDate: '2024-07-22', service: 'Médecine Générale', status: 'En observation', diagnosis: 'Déshydratation sévère', establishment: 'CSRéf de Djenné' },

    // CSCOM de Sangha (Usually transfer, but might keep for short observation)
    { id: 'H007', patientId: 'P008', patientName: 'Hawa Camara', admissionDate: '2024-07-20', service: 'Soins Primaires', status: 'Sorti', diagnosis: 'Observation post-traumatique', establishment: 'CSCOM de Sangha', dischargeDate: '2024-07-20' },
    
    // Cabinet Médical Nando (Unlikely to have hospitalizations, but for data completeness)
    { id: 'H008', patientId: 'P010', patientName: 'Fanta Cissé', admissionDate: '2024-07-19', service: 'Consultation Privée', status: 'Sorti', diagnosis: 'Mise en observation', establishment: 'Cabinet Médical Nando', dischargeDate: '2024-07-19' },
];

const allEstablishments = [...new Set(mockHospitalisations.map(h => h.establishment))];

/** Mapping des statuts d'hospitalisation à des couleurs pour le composant Badge. */
const statusColors: { [key in Hospitalisation['status']]: 'green' | 'yellow' | 'red' | 'blue' } = {
    "Stable": "green",
    "En observation": "yellow",
    "Critique": "red",
    "Sorti": "blue"
};

/**
 * Un composant réutilisable pour les filtres avancés (service, statut, recherche).
 * @param {{ data: Hospitalisation[], filters: object, onFilterChange: Function }} props
 */
const AdvancedFilters: React.FC<{
    data: Hospitalisation[];
    filters: { service: string; status: string; search: string; };
    onFilterChange: (filterName: string, value: string) => void;
}> = ({ data, filters, onFilterChange }) => {
    const availableServices = useMemo(() => [...new Set(data.map(h => h.service))].sort(), [data]);
    const availableStatuses = useMemo(() => [...new Set(data.map(h => h.status))].sort(), [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div>
                <label htmlFor="service-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
                <select id="service-filter" value={filters.service} onChange={e => onFilterChange('service', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Tous les services</option>
                    {availableServices.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
                <select id="status-filter" value={filters.status} onChange={e => onFilterChange('status', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Tous les statuts</option>
                    {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
                <label htmlFor="search-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche Patient / Diagnostic</label>
                <SearchInput value={filters.search} onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Rechercher..." />
            </div>
        </div>
    );
};

/**
 * Page pour la gestion des hospitalisations.
 * Cette page est un exemple clé de l'implémentation du RBAC :
 * - Les rôles de supervision (SUPER_ADMIN, MINISTERE_SIS) ont une vue d'ensemble de tous les établissements.
 * - Les rôles opérationnels (SIH, etc.) ont une vue limitée à leur propre établissement, avec des capacités CRUD.
 *
 * @param {{ user: User }} props - Les props du composant.
 * @returns {React.ReactElement} La page de gestion des hospitalisations.
 */
const HospitalisationsPage: React.FC<{ user: User }> = ({ user }) => {
    const [hospitalisations, setHospitalisations] = useState<Hospitalisation[]>(mockHospitalisations);
    const [editingHospitalisation, setEditingHospitalisation] = useState<Hospitalisation | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    
    const [filters, setFilters] = useState({
        establishment: [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? 'all' : user.establishment,
        service: 'all',
        status: 'all',
        search: '',
    });

    /** Gère les changements dans les champs de filtre. */
    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);
    
    /** Gère spécifiquement le changement du filtre d'établissement pour les superviseurs. */
    const handleEstablishmentFilterChange = (value: string) => {
        setFilters({
            establishment: value,
            service: 'all',
            status: 'all',
            search: '',
        });
    };
    
    /** Ouvre le modal pour modifier une hospitalisation existante. */
    const openEditModal = useCallback((hosp: Hospitalisation) => {
        setEditingHospitalisation(hosp);
        openModal();
    }, [openModal]);

    /** Ouvre le modal pour ajouter une nouvelle hospitalisation. */
    const openAddModal = useCallback(() => {
        setEditingHospitalisation(null);
        openModal();
    }, [openModal]);

    /** Gère la suppression d'une hospitalisation après confirmation. */
    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette hospitalisation ?')) {
            setHospitalisations(prev => prev.filter(h => h.id !== id));
        }
    }, []);

    /** Gère la soumission du formulaire d'ajout/modification. */
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const hospData = {
            patientName: formData.get('patientName') as string,
            admissionDate: formData.get('admissionDate') as string,
            service: formData.get('service') as string,
            status: formData.get('status') as Hospitalisation['status'],
            diagnosis: formData.get('diagnosis') as string,
        };

        if (editingHospitalisation) {
            setHospitalisations(prev => prev.map(h => h.id === editingHospitalisation.id ? { ...h, ...hospData } : h));
        } else {
            const newHosp: Hospitalisation = {
                ...hospData,
                id: 'H' + String(hospitalisations.length + 1).padStart(3, '0'),
                patientId: 'P' + Math.floor(Math.random() * 900 + 100),
                establishment: user.establishment,
            };
            setHospitalisations(prev => [newHosp, ...prev]);
        }
        closeModal();
    };

    /** Données de base utilisées pour peupler les menus déroulants des filtres. */
    const dataForFilters = useMemo(() => {
        const isSupervisor = [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role);
        if (isSupervisor) {
             if (filters.establishment === 'all') return hospitalisations;
             return hospitalisations.filter(h => h.establishment === filters.establishment);
        }
        return hospitalisations.filter(h => h.establishment === user.establishment);
    }, [user, hospitalisations, filters.establishment]);
    
    /** Données finales affichées dans le tableau, après application de tous les filtres. */
    const filteredData = useMemo(() => {
        return dataForFilters.filter(h => 
            (h.patientName.toLowerCase().includes(filters.search.toLowerCase()) || h.diagnosis.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.service === 'all' || h.service === filters.service) &&
            (filters.status === 'all' || h.status === filters.status)
        );
    }, [dataForFilters, filters]);

    /** Rend la vue pour les rôles de supervision (Super Admin, Ministère). */
    const renderSupervisorView = () => (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard title="Total Hospitalisations Actives" value={mockHospitalisations.filter(h => h.status !== 'Sorti').length} icon={<BedIcon className="w-8 h-8" />} color="text-blue-500" />
                <div className="md:col-span-2">
                    <Card>
                        <label htmlFor="establishment-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par établissement</label>
                        <select id="establishment-filter" value={filters.establishment} onChange={e => handleEstablishmentFilterChange(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option value="all">Tous les établissements</option>
                            {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </Card>
                </div>
            </div>
             {filters.establishment !== 'all' && (
                <AdvancedFilters data={filteredData} filters={filters} onFilterChange={handleFilterChange} />
            )}
            <Card>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                   {filters.establishment === 'all' ? 'Liste de toutes les hospitalisations' : `Hospitalisations de ${filters.establishment}`}
                </h3>
                <Table headers={["ID", "Patient", "Admission", "Service", "Statut", "Diagnostic", "Établissement"]} data={filteredData.map(h => [h.id, h.patientName, h.admissionDate, h.service, <Badge color={statusColors[h.status]} text={h.status} />, h.diagnosis, h.establishment])} />
            </Card>
        </div>
    );
    
    /** Rend la vue pour les rôles au niveau de l'établissement. */
    const renderEstablishmentView = () => {
        const canEdit = user.role === UserRole.SIH;
        const tableHeaders = ["ID", "Patient", "Admission", "Service", "Statut", "Diagnostic"];
        if (canEdit) tableHeaders.push("Actions");

        const tableData = filteredData.map(h => {
            const row: (string | React.ReactNode)[] = [h.id, h.patientName, h.admissionDate, h.service, <Badge color={statusColors[h.status]} text={h.status} />, h.diagnosis];
            if (canEdit) {
                row.push(
                    <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(h)} className="text-yellow-500 hover:text-yellow-700 p-1"><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                );
            }
            return row;
        });
        
        return (
            <div>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Hospitalisations - {user.establishment}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les hospitalisations de votre établissement.</p>
                    </div>
                    {canEdit && (
                        <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Ajouter
                        </button>
                    )}
                </div>
                <AdvancedFilters data={dataForFilters} filters={filters} onFilterChange={handleFilterChange} />
                <Card>
                    <Table headers={tableHeaders} data={tableData} />
                </Card>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion des Hospitalisations</h2>
            {[UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? renderSupervisorView() : renderEstablishmentView()}
            <Modal isOpen={isOpen} onClose={closeModal} title={editingHospitalisation ? "Modifier l'hospitalisation" : "Ajouter une hospitalisation"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium">Nom du patient</label>
                        <input type="text" name="patientName" id="patientName" defaultValue={editingHospitalisation?.patientName} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="admissionDate" className="block text-sm font-medium">Date d'admission</label>
                        <input type="date" name="admissionDate" id="admissionDate" defaultValue={editingHospitalisation?.admissionDate} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="service" className="block text-sm font-medium">Service</label>
                        <input type="text" name="service" id="service" defaultValue={editingHospitalisation?.service} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium">Statut</label>
                        <select name="status" id="status" defaultValue={editingHospitalisation?.status} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                            <option value="Stable">Stable</option>
                            <option value="En observation">En observation</option>
                            <option value="Critique">Critique</option>
                            <option value="Sorti">Sorti</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="diagnosis" className="block text-sm font-medium">Diagnostic</label>
                        <textarea name="diagnosis" id="diagnosis" defaultValue={editingHospitalisation?.diagnosis} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
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

export default HospitalisationsPage;
