/**
 * @file Contient le composant de la page de gestion des référencements et contre-référencements.
 * Ce module est crucial pour la coordination des soins entre les différents niveaux de la pyramide sanitaire.
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { User, Referencement, ReferencementUpdate } from '../../types';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, ClockIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '../ui/icons';
import Badge from '../ui/Badge';
import StatsCard from '../dashboard/StatsCard';


/** Données simulées pour les référencements. */
const mockReferencements: Referencement[] = [
    { 
        id: 'R001', patientName: 'Aliou Diallo', date: '2024-07-22', 
        originEstablishment: 'CSCOM de Sangha', destinationEstablishment: 'CSRéf de Djenné', 
        reason: 'Suspicion de fracture compliquée, besoin de radiographie.', 
        service: 'Soins Primaires', specialty: 'Traumatologie',
        status: 'En attente', 
        updateHistory: [{ status: 'En attente', date: '2024-07-22', updatedBy: 'Fatoumata Coulibaly' }] 
    },
    { 
        id: 'R002', patientName: 'Binta Keita', date: '2024-07-21', 
        originEstablishment: 'CSRéf de Djenné', destinationEstablishment: 'Hôpital Sominé Dolo', 
        reason: 'Besoin de chirurgie spécialisée (appendicectomie).', 
        service: 'Médecine Générale', specialty: 'Chirurgie Viscérale',
        status: 'Accepté', 
        updateHistory: [
            { status: 'En attente', date: '2024-07-21', updatedBy: 'Moussa Diarra' },
            { status: 'Accepté', date: '2024-07-22', updatedBy: 'Dr. Aminata Traoré', notes: 'Patient attendu en chirurgie demain matin.' }
        ] 
    },
    { 
        id: 'R003', patientName: 'Samba Touré', date: '2024-07-20', 
        originEstablishment: 'Cabinet Médical Étoile', destinationEstablishment: 'Hôpital Sominé Dolo', 
        reason: 'Urgence cardiologique, suspicion d\'infarctus.', 
        service: 'Consultation Privée', specialty: 'Cardiologie',
        status: 'Transféré', 
        updateHistory: [
            { status: 'En attente', date: '2024-07-20', updatedBy: 'Dr. Kante' },
            { status: 'Accepté', date: '2024-07-20', updatedBy: 'Dr. Traoré' },
            { status: 'Transféré', date: '2024-07-21', updatedBy: 'Dr. Traoré', notes: 'Patient admis en USIC.' }
        ] 
    },
    { 
        id: 'R004', patientName: 'Kadiatou Dembélé', date: '2024-07-19', 
        originEstablishment: 'CSCOM de Sangha', destinationEstablishment: 'CSRéf de Djenné', 
        reason: 'Complications de grossesse.', 
        service: 'Maternité', specialty: 'Gynécologie-Obstétrique',
        status: 'Refusé', 
        updateHistory: [
            { status: 'En attente', date: '2024-07-19', updatedBy: 'F. Coulibaly' },
            { status: 'Refusé', date: '2024-07-20', updatedBy: 'M. Diarra', notes: 'Manque de place, orienter vers Hôpital S. Dolo.' }
        ] 
    },
];

const allEstablishments = [...new Set(mockReferencements.flatMap(r => [r.originEstablishment, r.destinationEstablishment]))];

const statusColors: { [key in Referencement['status']]: 'yellow' | 'green' | 'red' | 'blue' } = {
    "En attente": "yellow",
    "Accepté": "green",
    "Refusé": "red",
    "Transféré": "blue"
};

/**
 * Page de gestion des référencements.
 * Ce composant implémente une logique RBAC complexe pour gérer le flux de référencement
 * et de contre-référencement entre les établissements de santé.
 *
 * @param {{ user: User }} props Les props du composant.
 * @returns {React.ReactElement} La page de gestion des référencements.
 */
const ReferencementsPage: React.FC<{ user: User }> = ({ user }) => {
    const [referencements, setReferencements] = useState<Referencement[]>(mockReferencements);
    const [selectedReferencement, setSelectedReferencement] = useState<Referencement | null>(null);
    const { isOpen: isFormOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
    const { isOpen: isHistoryOpen, openModal: openHistoryModal, closeModal: closeHistoryModal } = useModal();

    const [filters, setFilters] = useState({
        establishment: 'all',
        service: 'all',
        specialty: 'all',
        status: 'all',
        search: '',
    });

    const isSupervisor = [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role);

    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const openEditModal = useCallback((ref: Referencement) => {
        setSelectedReferencement(ref);
        openFormModal();
    }, [openFormModal]);

    const openAddModal = useCallback(() => {
        setSelectedReferencement(null);
        openFormModal();
    }, [openFormModal]);

    const viewHistory = useCallback((ref: Referencement) => {
        setSelectedReferencement(ref);
        openHistoryModal();
    }, [openHistoryModal]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce référencement ? Cette action est irréversible.')) {
            setReferencements(prev => prev.filter(r => r.id !== id));
        }
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const now = new Date().toISOString().split('T')[0];

        if (selectedReferencement) { // Mode édition (mise à jour du statut)
            const newStatus = formData.get('status') as Referencement['status'];
            const notes = formData.get('notes') as string;
            
            setReferencements(prev => prev.map(r => {
                if (r.id === selectedReferencement.id) {
                    const newUpdate: ReferencementUpdate = {
                        status: newStatus,
                        date: now,
                        updatedBy: user.name,
                        notes: notes || undefined
                    };
                    return { ...r, status: newStatus, updateHistory: [...r.updateHistory, newUpdate] };
                }
                return r;
            }));
        } else { // Mode ajout
            const newRef: Referencement = {
                id: 'R' + String(referencements.length + 1).padStart(3, '0'),
                patientName: formData.get('patientName') as string,
                date: now,
                originEstablishment: user.establishment,
                destinationEstablishment: formData.get('destinationEstablishment') as string,
                reason: formData.get('reason') as string,
                service: formData.get('service') as string,
                specialty: formData.get('specialty') as string,
                status: 'En attente',
                updateHistory: [{ status: 'En attente', date: now, updatedBy: user.name, notes: "Création du référencement." }],
            };
            setReferencements(prev => [newRef, ...prev]);
        }
        closeFormModal();
    };

    const userVisibleData = useMemo(() => {
         if (isSupervisor) return referencements;
        return referencements.filter(r => r.originEstablishment === user.establishment || r.destinationEstablishment === user.establishment);
    }, [user, referencements, isSupervisor]);

    const filteredData = useMemo(() => {
        return userVisibleData.filter(r =>
            (isSupervisor ? (filters.establishment === 'all' || r.originEstablishment === filters.establishment || r.destinationEstablishment === filters.establishment) : true) &&
            (isSupervisor ? (filters.service === 'all' || r.service === filters.service) : true) &&
            (isSupervisor ? (filters.specialty === 'all' || r.specialty === filters.specialty) : true) &&
            (filters.status === 'all' || r.status === filters.status) &&
            (r.patientName.toLowerCase().includes(filters.search.toLowerCase()) || r.reason.toLowerCase().includes(filters.search.toLowerCase()))
        );
    }, [userVisibleData, filters, isSupervisor]);
    
    const renderSupervisorView = () => {
        const stats = {
            total: referencements.length,
            enAttente: referencements.filter(r => r.status === 'En attente').length,
            acceptes: referencements.filter(r => r.status === 'Accepté' || r.status === 'Transféré').length,
        };
        const tableHeaders = ["Patient", "Origine", "Destination", "Service", "Spécialité", "Statut", "Actions"];
        const tableData = filteredData.map(r => [
            r.patientName, r.originEstablishment, r.destinationEstablishment, r.service, r.specialty,
            <Badge color={statusColors[r.status]} text={r.status} />,
            <div className="flex items-center space-x-2">
                <button onClick={() => viewHistory(r)} className="text-blue-500 hover:text-blue-700 p-1" title="Voir l'historique"><EyeIcon className="w-5 h-5" /></button>
            </div>
        ]);

        const availableServices = useMemo(() => [...new Set(referencements.map(r => r.service))].sort(), [referencements]);
        const availableSpecialties = useMemo(() => [...new Set(referencements.map(r => r.specialty))].sort(), [referencements]);

        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatsCard title="Total Référencements" value={stats.total} icon={<ArrowTrendingUpIcon className="w-8 h-8" />} color="text-blue-500" />
                    <StatsCard title="En Attente" value={stats.enAttente} icon={<ClockIcon className="w-8 h-8" />} color="text-yellow-500" />
                    <StatsCard title="Acceptés / Transférés" value={stats.acceptes} icon={<CheckCircleIcon className="w-8 h-8" />} color="text-green-500" />
                </div>
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <div>
                            <label className="text-sm font-medium">Établissement</label>
                            <select value={filters.establishment} onChange={e => handleFilterChange('establishment', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Tous</option>
                                {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Service</label>
                            <select value={filters.service} onChange={e => handleFilterChange('service', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Tous</option>
                                {availableServices.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Spécialité</label>
                            <select value={filters.specialty} onChange={e => handleFilterChange('specialty', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Toutes</option>
                                {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Statut</label>
                            <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Tous</option>
                                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="self-end">
                            <SearchInput value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Rechercher..." />
                        </div>
                    </div>
                    <Table headers={tableHeaders} data={tableData} />
                </Card>
            </div>
        );
    };

    const renderOperationalView = () => {
        const tableHeaders = ["Patient", "Date", "Origine", "Destination", "Service", "Statut", "Actions"];
        const tableData = filteredData.map(r => {
            const canUpdateStatus = r.destinationEstablishment === user.establishment && r.status === 'En attente';
            const canDelete = r.originEstablishment === user.establishment && r.status === 'En attente';
    
            return [
                r.patientName, r.date, r.originEstablishment, r.destinationEstablishment, r.service,
                <Badge color={statusColors[r.status]} text={r.status} />,
                <div className="flex items-center space-x-2">
                    <button onClick={() => viewHistory(r)} className="text-blue-500 hover:text-blue-700 p-1" title="Voir l'historique"><EyeIcon className="w-5 h-5" /></button>
                    {canUpdateStatus && <button onClick={() => openEditModal(r)} className="text-yellow-500 hover:text-yellow-700 p-1" title="Mettre à jour le statut"><PencilIcon className="w-5 h-5" /></button>}
                    {canDelete && <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer"><TrashIcon className="w-5 h-5" /></button>}
                </div>
            ];
        });
        
        return (
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par statut</label>
                        <select id="status-filter" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                            <option value="all">Tous les statuts</option>
                            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                        <SearchInput value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Rechercher un patient ou un motif..." />
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>
        );
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Référencements</h2>
                {!isSupervisor && (
                     <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Initier un référencement
                    </button>
                )}
            </div>
            
            {isSupervisor ? renderSupervisorView() : renderOperationalView()}

            <Modal isOpen={isFormOpen} onClose={closeFormModal} title={selectedReferencement ? "Mettre à jour le statut" : "Nouveau Référencement"}>
                <form onSubmit={handleSave} className="space-y-4">
                    {selectedReferencement ? (
                        <div>
                            <p><strong>Patient:</strong> {selectedReferencement.patientName}</p>
                            <p><strong>De:</strong> {selectedReferencement.originEstablishment}</p>
                            <p><strong>Motif:</strong> {selectedReferencement.reason}</p>
                            <div className="mt-4">
                                <label htmlFor="status" className="block text-sm font-medium">Nouveau Statut</label>
                                <select name="status" id="status" defaultValue={selectedReferencement.status} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    <option value="Accepté">Accepté</option>
                                    <option value="Refusé">Refusé</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="notes" className="block text-sm font-medium mt-2">Notes de contre-référence</label>
                                <textarea name="notes" id="notes" className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="patientName" className="block text-sm font-medium">Nom du patient</label>
                                <input type="text" name="patientName" id="patientName" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="destinationEstablishment" className="block text-sm font-medium">Établissement de destination</label>
                                <select name="destinationEstablishment" id="destinationEstablishment" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    {allEstablishments.filter(e => e !== user.establishment).map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="service" className="block text-sm font-medium">Service d'origine</label>
                                <input type="text" name="service" id="service" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="specialty" className="block text-sm font-medium">Spécialité requise</label>
                                <input type="text" name="specialty" id="specialty" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="reason" className="block text-sm font-medium">Motif du référencement</label>
                                <textarea name="reason" id="reason" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                            </div>
                        </>
                    )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeFormModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">Enregistrer</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isHistoryOpen} onClose={closeHistoryModal} title={`Historique du Référencement: ${selectedReferencement?.patientName}`}>
                {selectedReferencement && (
                    <div className="space-y-4">
                        <div className="text-sm">
                           <p><strong>Patient:</strong> {selectedReferencement.patientName}</p>
                           <p><strong>De:</strong> {selectedReferencement.originEstablishment} | <strong>À:</strong> {selectedReferencement.destinationEstablishment}</p>
                           <p><strong>Motif initial:</strong> {selectedReferencement.reason}</p>
                        </div>
                        <ul className="border-l-2 border-primary pl-4 space-y-4">
                           {selectedReferencement.updateHistory.map((update, index) => (
                               <li key={index} className="relative">
                                   <div className="absolute -left-[2.3rem] top-1.5 h-4 w-4 rounded-full bg-primary border-2 border-white dark:border-secondary"></div>
                                   <p className="font-semibold"><Badge color={statusColors[update.status]} text={update.status} /></p>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">
                                       <ClockIcon className="inline w-3 h-3 mr-1" />{new Date(update.date).toLocaleDateString('fr-FR')} par {update.updatedBy}
                                   </p>
                                   {update.notes && <p className="mt-1 p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md">"{update.notes}"</p>}
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReferencementsPage;