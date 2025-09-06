/**
 * @file Contient le composant pour la page de gestion des consultations.
 * C'est un composant complexe qui illustre une gestion d'accès basée sur les rôles (RBAC)
 * avec plusieurs niveaux de vue et de permissions.
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { User, Consultation } from '../../types';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';
import { DocumentTextIcon } from '../ui/icons';

/** Données de consultations simulées pour peupler la page. */
const mockConsultations: Consultation[] = [
    // Hôpital Sominé Dolo (More data)
    { id: 'C001', patientId: 'P001', patientName: 'Moussa Traoré', doctorName: 'Dr. Bamba', date: '2024-07-20', service: 'Chirurgie Générale', specialty: 'Chirurgie Viscérale', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Appendicite' },
    { id: 'C002', patientId: 'P002', patientName: 'Awa Diarra', doctorName: 'Dr. Touré', date: '2024-07-20', service: 'Pédiatrie', specialty: 'Pédiatrie', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Paludisme' },
    { id: 'C010', patientId: 'P015', patientName: 'Oumar Sangaré', doctorName: 'Dr. Cissé', date: '2024-07-21', service: 'Maternité', specialty: 'Gynécologie-Obstétrique', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Consultation prénatale' },
    { id: 'C011', patientId: 'P016', patientName: 'Aissata Maiga', doctorName: 'Dr. Bamba', date: '2024-07-21', service: 'Chirurgie Générale', specialty: 'Chirurgie Viscérale', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Hernie inguinale' },
    { id: 'C012', patientId: 'P017', patientName: 'Modibo Keita', doctorName: 'Dr. Touré', date: '2024-07-22', service: 'Pédiatrie', specialty: 'Pédiatrie', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Bronchiolite' },
    { id: 'C020', patientId: 'P025', patientName: 'Fatimata Diakité', doctorName: 'Dr. Sangaré', date: '2024-07-23', service: 'Cardiologie', specialty: 'Cardiologie', establishment: 'Hôpital Sominé Dolo', diagnosis: 'Hypertension artérielle' },
    
    // CSRéf de Djenné (More data)
    { id: 'C003', patientId: 'P007', patientName: 'Sékou Diallo', doctorName: 'Dr. Diarra', date: '2024-07-19', service: 'Médecine Générale', specialty: 'Médecine Générale', establishment: 'CSRéf de Djenné', diagnosis: 'Fièvre Typhoïde' },
    { id: 'C013', patientId: 'P018', patientName: 'Salimata Traoré', doctorName: 'Dr. Diarra', date: '2024-07-22', service: 'Médecine Générale', specialty: 'Médecine Générale', establishment: 'CSRéf de Djenné', diagnosis: 'Gastro-entérite' },
    { id: 'C021', patientId: 'P026', patientName: 'Mamadou Samaké', doctorName: 'Dr. Kéita', date: '2024-07-23', service: 'Petite Chirurgie', specialty: 'Chirurgie Mineure', establishment: 'CSRéf de Djenné', diagnosis: 'Suture de plaie' },
    { id: 'C022', patientId: 'P027', patientName: 'Binta Touré', doctorName: 'Dr. Diarra', date: '2024-07-23', service: 'Médecine Générale', specialty: 'Médecine Générale', establishment: 'CSRéf de Djenné', diagnosis: 'Anémie' },


    // CSCOM de Sangha (More data)
    { id: 'C004', patientId: 'P008', patientName: 'Hawa Camara', doctorName: 'Inf. Coulibaly', date: '2024-07-20', service: 'Soins Primaires', specialty: 'Soins Infirmiers', establishment: 'CSCOM de Sangha', diagnosis: 'Infection Respiratoire Aiguë' },
    { id: 'C014', patientId: 'P019', patientName: 'Daouda Sissoko', doctorName: 'Inf. Coulibaly', date: '2024-07-21', service: 'Soins Primaires', specialty: 'Soins Infirmiers', establishment: 'CSCOM de Sangha', diagnosis: 'Petite plaie' },
    { id: 'C023', patientId: 'P028', patientName: 'Kadidia Dembélé', doctorName: 'Sage-femme Traoré', date: '2024-07-22', service: 'Maternité', specialty: 'Suivi de grossesse', establishment: 'CSCOM de Sangha', diagnosis: 'CPN 1' },
    { id: 'C024', patientId: 'P029', patientName: 'Yacouba Diarra', doctorName: 'Inf. Coulibaly', date: '2024-07-23', service: 'Soins Primaires', specialty: 'Soins Infirmiers', establishment: 'CSCOM de Sangha', diagnosis: 'Paludisme simple' },

    // Cabinet Médical Étoile (More data)
    { id: 'C005', patientId: 'P009', patientName: 'Adama Koné', doctorName: 'Dr. Jean-Pierre Kante', date: '2024-07-20', service: 'Consultation Privée', specialty: 'Cardiologie', establishment: 'Cabinet Médical Étoile', diagnosis: 'Hypertension' },
    { id: 'C015', patientId: 'P020', patientName: 'Mariam Sidibé', doctorName: 'Dr. Jean-Pierre Kante', date: '2024-07-22', service: 'Consultation Privée', specialty: 'Cardiologie', establishment: 'Cabinet Médical Étoile', diagnosis: 'Suivi post-infarctus' },
    { id: 'C025', patientId: 'P030', patientName: 'Boubacar Diallo', doctorName: 'Dr. Jean-Pierre Kante', date: '2024-07-23', service: 'Consultation Privée', specialty: 'Médecine Générale', establishment: 'Cabinet Médical Étoile', diagnosis: 'Bilan de santé annuel' },

    // Cabinet Médical Nando (More data)
    { id: 'C006', patientId: 'P010', patientName: 'Fanta Cissé', doctorName: 'Dr. Mariam Diallo', date: '2024-07-19', service: 'Consultation Privée', specialty: 'Gynécologie', establishment: 'Cabinet Médical Nando', diagnosis: 'Suivi de grossesse' },
    { id: 'C026', patientId: 'P031', patientName: 'Aminata Sissoko', doctorName: 'Dr. Mariam Diallo', date: '2024-07-21', service: 'Consultation Privée', specialty: 'Pédiatrie', establishment: 'Cabinet Médical Nando', diagnosis: 'Vaccination' },
    { id: 'C027', patientId: 'P032', patientName: 'Alou Traoré', doctorName: 'Dr. Mariam Diallo', date: '2024-07-22', service: 'Consultation Privée', specialty: 'Médecine Générale', establishment: 'Cabinet Médical Nando', diagnosis: 'Grippe saisonnière' },
];


const allEstablishments = [...new Set(mockConsultations.map(c => c.establishment))];

/**
 * Un composant réutilisable qui affiche une série de filtres (menus déroulants, recherche)
 * pour affiner la liste des consultations.
 * @param {{ data: Consultation[], filters: object, onFilterChange: Function }} props
 */
const AdvancedFilters: React.FC<{
    data: Consultation[];
    filters: {
        service: string;
        specialty: string;
        doctor: string;
        search: string;
    };
    onFilterChange: (filterName: string, value: string) => void;
}> = ({ data, filters, onFilterChange }) => {
    const availableServices = useMemo(() => [...new Set(data.map(c => c.service))].sort(), [data]);
    const availableSpecialties = useMemo(() => [...new Set(data.map(c => c.specialty))].sort(), [data]);
    const availableDoctors = useMemo(() => [...new Set(data.map(c => c.doctorName))].sort(), [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div>
                <label htmlFor="service-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
                <select id="service-filter" value={filters.service} onChange={e => onFilterChange('service', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Tous les services</option>
                    {availableServices.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="specialty-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Spécialité</label>
                <select id="specialty-filter" value={filters.specialty} onChange={e => onFilterChange('specialty', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Toutes les spécialités</option>
                    {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="doctor-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Médecin</label>
                <select id="doctor-filter" value={filters.doctor} onChange={e => onFilterChange('doctor', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Tous les médecins</option>
                    {availableDoctors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="search-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche Patient / Diagnostic</label>
                <SearchInput value={filters.search} onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Rechercher..." />
            </div>
        </div>
    );
};


/**
 * La page de gestion des consultations.
 * Affiche des vues et fonctionnalités conditionnelles basées sur le rôle de l'utilisateur :
 * - `SUPER_ADMIN` / `MINISTERE_SIS`: Vue de supervision globale avec filtre par établissement.
 * - `ADMIN_LOCAL`: Vue de tableau de bord détaillée pour son établissement avec filtres avancés.
 * - Autres rôles (SIH, etc.) : Vue opérationnelle avec fonctionnalités CRUD complètes pour leur établissement.
 *
 * @param {{ user: User }} props - Les props du composant.
 * @returns {React.ReactElement} La page de gestion des consultations.
 */
const ConsultationsPage: React.FC<{ user: User }> = ({ user }) => {
    const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
    const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    
    const [filters, setFilters] = useState({
        establishment: user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MINISTERE_SIS ? 'all' : user.establishment,
        service: 'all',
        specialty: 'all',
        doctor: 'all',
        search: '',
    });

    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);
    
    const handleEstablishmentFilterChange = (value: string) => {
        setFilters({
            establishment: value,
            service: 'all',
            specialty: 'all',
            doctor: 'all',
            search: '',
        });
    };

    const openEditModal = useCallback((consultation: Consultation) => {
        setEditingConsultation(consultation);
        openModal();
    }, [openModal]);

    const openAddModal = useCallback(() => {
        setEditingConsultation(null);
        openModal();
    }, [openModal]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
            setConsultations(prev => prev.filter(c => c.id !== id));
        }
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const consultationData: Omit<Consultation, 'id' | 'establishment'> = {
            patientName: formData.get('patientName') as string,
            doctorName: formData.get('doctorName') as string,
            date: formData.get('date') as string,
            service: formData.get('service') as string,
            specialty: formData.get('specialty') as string,
            diagnosis: formData.get('diagnosis') as string,
            patientId: 'P' + Math.floor(Math.random() * 900 + 100),
        };

        if (editingConsultation) {
            setConsultations(prev => prev.map(c => c.id === editingConsultation.id ? { ...c, ...consultationData } : c));
        } else {
            const newConsultation: Consultation = { 
                ...consultationData, 
                id: 'C' + String(consultations.length + 1).padStart(3, '0'),
                establishment: user.establishment,
            };
            setConsultations(prev => [newConsultation, ...prev]);
        }
        closeModal();
    };

    /**
     * Calcule les données de base à utiliser pour les filtres avancés.
     * Pour un superviseur, cela ne renvoie des données que si un établissement est sélectionné.
     */
    const dataForFilters = useMemo(() => {
        const isSupervisor = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MINISTERE_SIS;
        if (isSupervisor) {
             if (filters.establishment === 'all') return []; // Pas de données pour les filtres si aucun établissement n'est sélectionné
             return consultations.filter(c => c.establishment === filters.establishment);
        }
        return consultations.filter(c => c.establishment === user.establishment);
    }, [user, consultations, filters.establishment]);
    
    /**
     * Calcule les données finales à afficher dans le tableau après application de tous les filtres.
     */
    const filteredData = useMemo(() => {
        const dataToFilter = (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MINISTERE_SIS) && filters.establishment === 'all'
            ? consultations
            : dataForFilters;

        return dataToFilter.filter(c => 
            (c.patientName.toLowerCase().includes(filters.search.toLowerCase()) || c.diagnosis.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.service === 'all' || c.service === filters.service) &&
            (filters.specialty === 'all' || c.specialty === filters.specialty) &&
            (filters.doctor === 'all' || c.doctorName === filters.doctor)
        );
    }, [dataForFilters, filters, user.role, consultations]);

    /** Rend la vue pour les rôles de supervision. */
    const renderSupervisorView = () => (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard title="Total Consultations" value={mockConsultations.length} icon={<DocumentTextIcon className="w-8 h-8" />} color="text-blue-500" />
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
                <AdvancedFilters data={dataForFilters} filters={filters} onFilterChange={handleFilterChange} />
            )}
            <Card>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                   {filters.establishment === 'all' ? 'Liste de toutes les consultations' : `Consultations de ${filters.establishment}`}
                </h3>
                <Table headers={["ID", "Patient", "Médecin", "Date", "Diagnostic", "Établissement"]} data={filteredData.map(c => [c.id, c.patientName, c.doctorName, c.date, c.diagnosis, c.establishment])} />
            </Card>
        </div>
    );

    /** Rend la vue pour les rôles au niveau de l'établissement (Admin Local et opérateurs). */
    const renderEstablishmentView = () => {
        const isOperator = user.role !== UserRole.ADMIN_LOCAL && user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MINISTERE_SIS;
        const tableHeaders = isOperator
            ? ["ID", "Patient", "Médecin", "Date", "Diagnostic", "Actions"]
            : ["ID", "Patient", "Médecin", "Date", "Service", "Diagnostic"];

        const tableData = filteredData.map(c => {
            const row: (string | React.ReactNode)[] = [c.id, c.patientName, c.doctorName, c.date];
            if (!isOperator) row.push(c.service);
            row.push(c.diagnosis);
            if (isOperator) {
                row.push(
                    <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(c)} className="text-yellow-500 hover:text-yellow-700 p-1"><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                );
            }
            return row;
        });

        return (
            <div>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Consultations - {user.establishment}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les consultations de votre établissement.</p>
                    </div>
                    {isOperator && (
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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion des Consultations</h2>
            {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MINISTERE_SIS) ? renderSupervisorView() : renderEstablishmentView()}
            <Modal isOpen={isOpen} onClose={closeModal} title={editingConsultation ? "Modifier la consultation" : "Ajouter une consultation"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium">Nom du patient</label>
                        <input type="text" name="patientName" id="patientName" defaultValue={editingConsultation?.patientName} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="doctorName" className="block text-sm font-medium">Médecin</label>
                        <input type="text" name="doctorName" id="doctorName" defaultValue={editingConsultation?.doctorName} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium">Date</label>
                        <input type="date" name="date" id="date" defaultValue={editingConsultation?.date} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="service" className="block text-sm font-medium">Service</label>
                        <input type="text" name="service" id="service" defaultValue={editingConsultation?.service} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="specialty" className="block text-sm font-medium">Spécialité</label>
                        <input type="text" name="specialty" id="specialty" defaultValue={editingConsultation?.specialty} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="diagnosis" className="block text-sm font-medium">Diagnostic</label>
                        <textarea name="diagnosis" id="diagnosis" defaultValue={editingConsultation?.diagnosis} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
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

export default ConsultationsPage;
