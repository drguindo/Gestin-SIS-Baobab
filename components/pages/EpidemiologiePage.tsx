import React, { useState, useMemo, useCallback } from 'react';
import type { User, EpidemiologyCase } from '../../types';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon, GlobeAltIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';

const mockEpidemiologyCases: EpidemiologyCase[] = [
    // Hôpital Sominé Dolo
    { id: 'E001', patientName: 'Enfant Anonyme 1', disease: 'Rougeole', caseDate: '2024-07-18', location: 'Pédiatrie', establishment: 'Hôpital Sominé Dolo' },
    { id: 'E002', patientName: 'Adama Traoré', disease: 'Paludisme Grave', caseDate: '2024-07-20', location: 'Médecine Interne', establishment: 'Hôpital Sominé Dolo' },

    // CSRéf de Djenné
    { id: 'E003', patientName: 'Aissata Kante', disease: 'Méningite', caseDate: '2024-07-19', location: 'Médecine Générale', establishment: 'CSRéf de Djenné' },
    { id: 'E004', patientName: 'Moussa Fofana', disease: 'Fièvre Typhoïde', caseDate: '2024-07-21', location: 'Médecine Générale', establishment: 'CSRéf de Djenné' },

    // CSCOM de Sangha
    { id: 'E005', patientName: 'Fatou Diarra', disease: 'Paludisme simple', caseDate: '2024-07-22', location: 'Soins Primaires', establishment: 'CSCOM de Sangha' },
    { id: 'E006', patientName: 'Sidi Coulibaly', disease: 'Infection Respiratoire Aiguë', caseDate: '2024-07-23', location: 'Soins Primaires', establishment: 'CSCOM de Sangha' },
    { id: 'E010', patientName: 'Enfant Anonyme 2', disease: 'Rougeole', caseDate: '2024-07-24', location: 'Soins Primaires', establishment: 'CSCOM de Sangha' },

    // Cabinet Médical Étoile
    { id: 'E007', patientName: 'Oumar Sanogo', disease: 'Grippe (cas sévère)', caseDate: '2024-07-20', location: 'Consultation Privée', establishment: 'Cabinet Médical Étoile' },
    
    // Cabinet Médical Nando
    { id: 'E008', patientName: 'Mariam Traoré', disease: 'Gastro-entérite épidémique', caseDate: '2024-07-21', location: 'Consultation Privée', establishment: 'Cabinet Médical Nando' },
];


const allEstablishments = [...new Set(mockEpidemiologyCases.map(c => c.establishment))];

const AdvancedFilters: React.FC<{
    data: EpidemiologyCase[];
    filters: { disease: string; location: string; search: string; };
    onFilterChange: (filterName: string, value: string) => void;
}> = ({ data, filters, onFilterChange }) => {
    const availableDiseases = useMemo(() => [...new Set(data.map(c => c.disease))].sort(), [data]);
    const availableLocations = useMemo(() => [...new Set(data.map(c => c.location))].sort(), [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div>
                <label htmlFor="disease-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Maladie</label>
                <select id="disease-filter" value={filters.disease} onChange={e => onFilterChange('disease', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Toutes les maladies</option>
                    {availableDiseases.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="location-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Localisation (Service/Unité)</label>
                <select id="location-filter" value={filters.location} onChange={e => onFilterChange('location', e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="all">Toutes les localisations</option>
                    {availableLocations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
                <label htmlFor="search-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche Patient / Maladie</label>
                <SearchInput value={filters.search} onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Rechercher..." />
            </div>
        </div>
    );
};

const EpidemiologiePage: React.FC<{ user: User }> = ({ user }) => {
    const [cases, setCases] = useState<EpidemiologyCase[]>(mockEpidemiologyCases);
    const [editingCase, setEditingCase] = useState<EpidemiologyCase | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    
    const [filters, setFilters] = useState({
        establishment: [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? 'all' : user.establishment,
        disease: 'all',
        location: 'all',
        search: '',
    });

    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const handleEstablishmentFilterChange = (value: string) => {
        setFilters({
            establishment: value,
            disease: 'all',
            location: 'all',
            search: '',
        });
    };

    const openEditModal = useCallback((epiCase: EpidemiologyCase) => {
        setEditingCase(epiCase);
        openModal();
    }, [openModal]);

    const openAddModal = useCallback(() => {
        setEditingCase(null);
        openModal();
    }, [openModal]);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette déclaration ?')) {
            setCases(prev => prev.filter(c => c.id !== id));
        }
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const caseData = {
            patientName: formData.get('patientName') as string,
            disease: formData.get('disease') as string,
            caseDate: formData.get('caseDate') as string,
            location: formData.get('location') as string,
        };

        if (editingCase) {
            setCases(prev => prev.map(c => c.id === editingCase.id ? { ...c, ...caseData } : c));
        } else {
            const newCase: EpidemiologyCase = {
                ...caseData,
                id: 'E' + String(cases.length + 1).padStart(3, '0'),
                establishment: user.establishment,
            };
            setCases(prev => [newCase, ...prev]);
        }
        closeModal();
    };

    const dataForFilters = useMemo(() => {
        const isSupervisor = [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role);
        if (isSupervisor) {
             if (filters.establishment === 'all') return [];
             return cases.filter(c => c.establishment === filters.establishment);
        }
        return cases.filter(c => c.establishment === user.establishment);
    }, [user, cases, filters.establishment]);
    
    const filteredData = useMemo(() => {
        const dataToFilter = [UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) && filters.establishment === 'all'
            ? cases
            : dataForFilters;

        return dataToFilter.filter(c => 
            (c.patientName.toLowerCase().includes(filters.search.toLowerCase()) || c.disease.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.disease === 'all' || c.disease === filters.disease) &&
            (filters.location === 'all' || c.location === filters.location)
        );
    }, [dataForFilters, filters, user.role, cases]);

    const renderSupervisorView = () => (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard title="Total Cas Déclarés" value={cases.length} icon={<GlobeAltIcon className="w-8 h-8" />} color="text-red-500" />
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
                   {filters.establishment === 'all' ? 'Liste de tous les cas déclarés' : `Cas de ${filters.establishment}`}
                </h3>
                <Table headers={["ID", "Patient", "Maladie", "Date", "Localisation", "Établissement"]} data={filteredData.map(c => [c.id, c.patientName, c.disease, c.caseDate, c.location, c.establishment])} />
            </Card>
        </div>
    );
    
    const renderEstablishmentView = () => {
        const canEdit = [UserRole.SIH, UserRole.SIS_CSCOM, UserRole.SIS_CSREF, UserRole.SIS_CABINET].includes(user.role);
        const tableHeaders = ["ID", "Patient", "Maladie", "Date", "Localisation"];
        if (canEdit) tableHeaders.push("Actions");

        const tableData = filteredData.map(c => {
            const row: (string | React.ReactNode)[] = [c.id, c.patientName, c.disease, c.caseDate, c.location];
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
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Déclarations - {user.establishment}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les cas de surveillance épidémiologique.</p>
                    </div>
                    {canEdit && (
                        <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Déclarer un cas
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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Surveillance Épidémiologique</h2>
            {[UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS, UserRole.SIS_INRSP].includes(user.role) ? renderSupervisorView() : renderEstablishmentView()}
            <Modal isOpen={isOpen} onClose={closeModal} title={editingCase ? "Modifier la déclaration" : "Déclarer un nouveau cas"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium">Nom du patient</label>
                        <input type="text" name="patientName" id="patientName" defaultValue={editingCase?.patientName} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="disease" className="block text-sm font-medium">Maladie</label>
                        <input type="text" name="disease" id="disease" defaultValue={editingCase?.disease} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="caseDate" className="block text-sm font-medium">Date du cas</label>
                        <input type="date" name="caseDate" id="caseDate" defaultValue={editingCase?.caseDate} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium">Localisation (Service/Unité)</label>
                        <input type="text" name="location" id="location" defaultValue={editingCase?.location} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
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

export default EpidemiologiePage;
