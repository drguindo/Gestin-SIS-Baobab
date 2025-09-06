/**
 * @file Contient le composant pour la page de surveillance de la Résistance aux Antimicrobiens (RAM).
 * Ce module permet la collecte, la transmission et la supervision des cas de RAM à travers la pyramide sanitaire.
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { User, RAMCase } from '../../types';
import { UserRole, ResistanceLevel } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon, BeakerIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';
import Badge from '../ui/Badge';

/** Données simulées pour les cas de RAM. */
const mockRAMCases: RAMCase[] = [
    // Hôpital Sominé Dolo (Laboratoire de référence)
    { id: 'RAM001', microorganism: 'Escherichia coli', antibiotic: 'Ceftriaxone', resistanceLevel: ResistanceLevel.RESISTANT, sampleType: 'Urine', caseDate: '2024-07-20', laboratory: 'Labo HSD', establishment: 'Hôpital Sominé Dolo', service: 'Médecine Interne', specialty: 'Infectiologie' },
    { id: 'RAM002', microorganism: 'Staphylococcus aureus', antibiotic: 'Pénicilline', resistanceLevel: ResistanceLevel.RESISTANT, sampleType: 'Sang', caseDate: '2024-07-21', laboratory: 'Labo HSD', establishment: 'Hôpital Sominé Dolo', comment: 'SARM suspecté.', service: 'Chirurgie', specialty: 'Chirurgie Viscérale' },
    { id: 'RAM003', microorganism: 'Klebsiella pneumoniae', antibiotic: 'Imipénème', resistanceLevel: ResistanceLevel.SENSIBLE, sampleType: 'LCR', caseDate: '2024-07-22', laboratory: 'Labo HSD', establishment: 'Hôpital Sominé Dolo', service: 'Pédiatrie', specialty: 'Néonatologie' },
    
    // CSRéf de Djenné
    { id: 'RAM004', microorganism: 'Streptococcus pneumoniae', antibiotic: 'Amoxicilline', resistanceLevel: ResistanceLevel.INTERMEDIAIRE, sampleType: 'Prélèvement de gorge', caseDate: '2024-07-19', laboratory: 'Labo CSRéf Djenné', establishment: 'CSRéf de Djenné', service: 'Médecine Générale', specialty: 'Médecine Générale' },
    
    // CSCOM de Sangha (transmet les prélèvements)
    { id: 'RAM005', microorganism: 'Salmonella Typhi', antibiotic: 'Ciprofloxacine', resistanceLevel: ResistanceLevel.RESISTANT, sampleType: 'Hémoculture', caseDate: '2024-07-18', laboratory: 'Transmis à HSD', establishment: 'CSCOM de Sangha', service: 'Soins Primaires', specialty: 'Soins Infirmiers' },
    
    // Cabinet Médical Étoile
    { id: 'RAM006', microorganism: 'Escherichia coli', antibiotic: 'Amoxicilline', resistanceLevel: ResistanceLevel.SENSIBLE, sampleType: 'Urine', caseDate: '2024-07-23', laboratory: 'Partenaire privé', establishment: 'Cabinet Médical Étoile', service: 'Consultation Privée', specialty: 'Médecine Générale' },
];


const allEstablishments = [...new Set(mockRAMCases.map(c => c.establishment))];

/** Mapping des niveaux de résistance à des couleurs pour le composant Badge. */
const resistanceColors: { [key in ResistanceLevel]: 'green' | 'yellow' | 'red' } = {
    [ResistanceLevel.SENSIBLE]: "green",
    [ResistanceLevel.INTERMEDIAIRE]: "yellow",
    [ResistanceLevel.RESISTANT]: "red",
};

/**
 * Page pour la surveillance de la Résistance aux Antimicrobiens (RAM).
 * Affiche des vues et fonctionnalités conditionnelles basées sur le rôle de l'utilisateur :
 * - `SUPER_ADMIN` / `MINISTERE_SIS`: Vue de supervision globale avec filtres.
 * - Rôles opérationnels : Vue de saisie et consultation pour leur propre établissement.
 *
 * @param {{ user: User }} props - Les props du composant.
 * @returns {React.ReactElement} La page de surveillance RAM.
 */
const SurveillanceRAMPage: React.FC<{ user: User }> = ({ user }) => {
    const [ramCases, setRamCases] = useState<RAMCase[]>(mockRAMCases);
    const [editingCase, setEditingCase] = useState<RAMCase | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    
    const [filters, setFilters] = useState({
        establishment: [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? 'all' : user.establishment,
        resistanceLevel: 'all',
        search: '',
        service: 'all',
        specialty: 'all',
    });

    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const handleEstablishmentFilterChange = useCallback((value: string) => {
        setFilters(prev => ({ ...prev, establishment: value, service: 'all', specialty: 'all' }));
    }, []);
    
    const handleServiceFilterChange = useCallback((value: string) => {
        setFilters(prev => ({ ...prev, service: value, specialty: 'all' }));
    }, []);

    const openEditModal = useCallback((ramCase: RAMCase) => {
        setEditingCase(ramCase);
        openModal();
    }, [openModal]);

    const openAddModal = useCallback(() => {
        setEditingCase(null);
        openModal();
    }, [openModal]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette déclaration de RAM ?')) {
            setRamCases(prev => prev.filter(c => c.id !== id));
        }
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const caseData = {
            microorganism: formData.get('microorganism') as string,
            antibiotic: formData.get('antibiotic') as string,
            resistanceLevel: formData.get('resistanceLevel') as ResistanceLevel,
            sampleType: formData.get('sampleType') as string,
            service: formData.get('service') as string,
            specialty: formData.get('specialty') as string,
            caseDate: formData.get('caseDate') as string,
            laboratory: formData.get('laboratory') as string,
            comment: formData.get('comment') as string,
        };

        if (editingCase) {
            setRamCases(prev => prev.map(c => c.id === editingCase.id ? { ...c, ...caseData } : c));
        } else {
            const newCase: RAMCase = {
                ...caseData,
                id: 'RAM' + String(ramCases.length + 1).padStart(3, '0'),
                establishment: user.establishment,
            };
            setRamCases(prev => [newCase, ...prev]);
        }
        closeModal();
    };

    const userVisibleData = useMemo(() => {
        const isSupervisor = [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role);
        if (isSupervisor) {
            return ramCases;
        }
        return ramCases.filter(c => c.establishment === user.establishment);
    }, [user, ramCases]);

    const filteredData = useMemo(() => {
        return userVisibleData.filter(c =>
            (filters.establishment === 'all' || c.establishment === filters.establishment) &&
            (c.microorganism.toLowerCase().includes(filters.search.toLowerCase()) || c.antibiotic.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.resistanceLevel === 'all' || c.resistanceLevel === filters.resistanceLevel) &&
            (filters.service === 'all' || c.service === filters.service) &&
            (filters.specialty === 'all' || c.specialty === filters.specialty)
        );
    }, [userVisibleData, filters]);

    /** Rend la vue pour les rôles de supervision (Super Admin, Ministère). */
    const renderSupervisorView = () => {
        const availableServices = useMemo(() => {
            const relevantCases = filters.establishment === 'all' 
                ? ramCases 
                : ramCases.filter(c => c.establishment === filters.establishment);
            return [...new Set(relevantCases.map(c => c.service))].sort();
        }, [filters.establishment, ramCases]);

        const availableSpecialties = useMemo(() => {
            let relevantCases = filters.establishment === 'all' 
                ? ramCases 
                : ramCases.filter(c => c.establishment === filters.establishment);
            if (filters.service !== 'all') {
                relevantCases = relevantCases.filter(c => c.service === filters.service);
            }
            return [...new Set(relevantCases.map(c => c.specialty))].sort();
        }, [filters.establishment, filters.service, ramCases]);
        
        return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard title="Total Cas Déclarés" value={ramCases.length} icon={<BeakerIcon className="w-8 h-8" />} color="text-indigo-500" />
                <StatsCard title="Cas Résistants" value={ramCases.filter(c => c.resistanceLevel === ResistanceLevel.RESISTANT).length} icon={<BeakerIcon className="w-8 h-8" />} color="text-red-500" />
                <StatsCard title="Cas Sensibles" value={ramCases.filter(c => c.resistanceLevel === ResistanceLevel.SENSIBLE).length} icon={<BeakerIcon className="w-8 h-8" />} color="text-green-500" />
            </div>
            <Card>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Filtres de supervision</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                     <div>
                        <label htmlFor="establishment-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Établissement</label>
                        <select id="establishment-filter" value={filters.establishment} onChange={e => handleEstablishmentFilterChange(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option value="all">Tous les établissements</option>
                            {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
                        <select id="service-filter" value={filters.service} onChange={e => handleServiceFilterChange(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option value="all">Tous les services</option>
                            {availableServices.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Spécialité</label>
                        <select id="specialty-filter" value={filters.specialty} onChange={e => handleFilterChange('specialty', e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option value="all">Toutes les spécialités</option>
                            {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                         <label htmlFor="resistance-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Niveau de résistance</label>
                         <select id="resistance-filter" value={filters.resistanceLevel} onChange={e => handleFilterChange('resistanceLevel', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                            <option value="all">Tous les niveaux</option>
                            {Object.values(ResistanceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                     <div className="lg:col-span-2">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                        <SearchInput value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="Micro-organisme, antibiotique..." />
                    </div>
                </div>
                <Table 
                    headers={["ID", "Micro-organisme", "Antibiotique", "Résistance", "Service", "Date", "Établissement"]} 
                    data={filteredData.map(c => [c.id, c.microorganism, c.antibiotic, <Badge color={resistanceColors[c.resistanceLevel]} text={c.resistanceLevel} />, c.service, c.caseDate, c.establishment])} 
                />
            </Card>
        </div>
    )};

    /** Rend la vue pour les rôles au niveau de l'établissement. */
    const renderEstablishmentView = () => {
        const canEdit = ![UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.ADMIN_LOCAL].includes(user.role);
        const tableHeaders = ["ID", "Micro-organisme", "Antibiotique", "Résistance", "Service", "Date"];
        if (canEdit) tableHeaders.push("Actions");

        const tableData = filteredData.map(c => {
            const row: (string | React.ReactNode)[] = [c.id, c.microorganism, c.antibiotic, <Badge color={resistanceColors[c.resistanceLevel]} text={c.resistanceLevel} />, c.service, c.caseDate];
            if (canEdit) {
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
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Cas de RAM - {user.establishment}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Déclarez et consultez les cas de résistance aux antimicrobiens.</p>
                    </div>
                    {canEdit && (
                        <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Déclarer un cas
                        </button>
                    )}
                </div>
                <Card>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="resistance-filter" className="text-sm font-medium">Niveau de résistance</label>
                            <select id="resistance-filter" value={filters.resistanceLevel} onChange={e => handleFilterChange('resistanceLevel', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Tous les niveaux</option>
                                {Object.values(ResistanceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="text-sm font-medium">Recherche</label>
                            <SearchInput value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="Micro-organisme, antibiotique..." />
                        </div>
                    </div>
                    <Table headers={tableHeaders} data={tableData} />
                </Card>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Surveillance de la Résistance aux Antimicrobiens (RAM)</h2>
            {[UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? renderSupervisorView() : renderEstablishmentView()}
            
            <Modal isOpen={isOpen} onClose={closeModal} title={editingCase ? "Modifier la déclaration RAM" : "Déclarer un nouveau cas RAM"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="microorganism" className="block text-sm font-medium">Micro-organisme</label>
                            <input type="text" name="microorganism" id="microorganism" defaultValue={editingCase?.microorganism} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="antibiotic" className="block text-sm font-medium">Antibiotique</label>
                            <input type="text" name="antibiotic" id="antibiotic" defaultValue={editingCase?.antibiotic} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="resistanceLevel" className="block text-sm font-medium">Niveau de Résistance</label>
                        <select name="resistanceLevel" id="resistanceLevel" defaultValue={editingCase?.resistanceLevel} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                            {Object.values(ResistanceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium">Service</label>
                            <input type="text" name="service" id="service" defaultValue={editingCase?.service} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-medium">Spécialité</label>
                            <input type="text" name="specialty" id="specialty" defaultValue={editingCase?.specialty} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="sampleType" className="block text-sm font-medium">Type de prélèvement</label>
                            <input type="text" name="sampleType" id="sampleType" defaultValue={editingCase?.sampleType} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="caseDate" className="block text-sm font-medium">Date du cas</label>
                            <input type="date" name="caseDate" id="caseDate" defaultValue={editingCase?.caseDate} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="laboratory" className="block text-sm font-medium">Laboratoire</label>
                        <input type="text" name="laboratory" id="laboratory" defaultValue={editingCase?.laboratory} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium">Commentaire (optionnel)</label>
                        <textarea name="comment" id="comment" defaultValue={editingCase?.comment} rows={2} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
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

export default SurveillanceRAMPage;