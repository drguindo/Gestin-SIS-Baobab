/**
 * @file Contient le composant pour la page de gestion des campagnes de santé publique.
 * Ce module permet une gestion coordonnée, un suivi et une évaluation des campagnes
 * à travers les différents niveaux de la pyramide sanitaire.
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { User, Campagne, CampaignProgress } from '../../types';
import { UserRole } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, PencilIcon, TrashIcon, MegaphoneIcon, CheckCircleIcon, ClockIcon, EyeIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';
import Badge from '../ui/Badge';

// Données simulées étendues pour le suivi
const mockCampagnes: Campagne[] = [
    { 
        id: 'CAMP01', nom: 'Campagne Nationale de Vaccination contre la Polio', type: 'Vaccination', 
        coordinatingBody: 'CSRéf de Djenné', dateDebut: '2024-08-01', dateFin: '2024-08-15', 
        targetPopulation: 5000, status: 'En cours',
        progress: [
            { establishment: 'CSCOM de Sangha', target: 200, achieved: 150 },
            { establishment: 'Cabinet Médical Étoile', target: 50, achieved: 25 },
        ]
    },
    { 
        id: 'CAMP02', nom: 'Sensibilisation au lavage des mains', type: 'Sensibilisation',
        coordinatingBody: 'Hôpital Sominé Dolo', dateDebut: '2024-07-10', dateFin: '2024-09-30', 
        targetPopulation: 10000, status: 'En cours',
        progress: [
            { establishment: 'CSCOM de Sangha', target: 1000, achieved: 800 },
            { establishment: 'CSRéf de Djenné', target: 3000, achieved: 1500 },
            { establishment: 'Hôpital Sominé Dolo', target: 6000, achieved: 4500 },
        ]
    },
    { 
        id: 'CAMP03', nom: 'Dépistage du diabète et de l\'HTA', type: 'Dépistage',
        coordinatingBody: 'CSRéf de Djenné', dateDebut: '2024-09-01', dateFin: '2024-09-07', 
        targetPopulation: 800, status: 'Planifiée',
        progress: [
            { establishment: 'Cabinet Médical Étoile', target: 400, achieved: 0 },
            { establishment: 'Cabinet Médical Nando', target: 400, achieved: 0 },
        ]
    },
    { 
        id: 'CAMP04', nom: 'Campagne de vaccination anti-rougeole (2023)', type: 'Vaccination',
        coordinatingBody: 'CSRéf de Djenné', dateDebut: '2023-11-01', dateFin: '2023-11-15', 
        targetPopulation: 1500, status: 'Terminée',
        progress: [
            { establishment: 'CSCOM de Sangha', target: 1500, achieved: 1450 },
        ]
    },
];

const allEstablishmentsForPlanning = [
    'Hôpital Sominé Dolo',
    'CSRéf de Djenné',
    'CSCOM de Sangha',
    'Cabinet Médical Étoile',
    'Cabinet Médical Nando'
];

const statusColors: { [key in Campagne['status']]: 'blue' | 'yellow' | 'green' } = {
    "En cours": "blue", "Planifiée": "yellow", "Terminée": "green"
};

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
    const percentage = Math.round(value * 100);
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div className="bg-primary h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${percentage}%` }}>
                {percentage > 10 ? `${percentage}%` : ''}
            </div>
        </div>
    );
};

const CampagnesPage: React.FC<{ user: User }> = ({ user }) => {
    const [campagnes, setCampagnes] = useState<Campagne[]>(mockCampagnes);
    const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(null);
    const { isOpen: isFormOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
    const { isOpen: isReportOpen, openModal: openReportModal, closeModal: closeReportModal } = useModal();
    const { isOpen: isEvalOpen, openModal: openEvalModal, closeModal: closeEvalModal } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [reportValue, setReportValue] = useState(0);
    const [formProgress, setFormProgress] = useState<Partial<CampaignProgress>[]>([]);

    const isSupervisor = [UserRole.SIS_CSREF, UserRole.ADMIN_LOCAL, UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS].includes(user.role);

    const openAddModal = useCallback(() => {
        setSelectedCampagne(null);
        setFormProgress([{ establishment: '', target: 0, achieved: 0 }]);
        openFormModal();
    }, [openFormModal]);

    const handleReportProgress = useCallback((campagne: Campagne) => {
        setSelectedCampagne(campagne);
        const progress = campagne.progress.find(p => p.establishment === user.establishment);
        setReportValue(progress ? progress.achieved : 0);
        openReportModal();
    }, [user.establishment, openReportModal]);
    
    const viewEvaluation = useCallback((campagne: Campagne) => {
        setSelectedCampagne(campagne);
        openEvalModal();
    }, [openEvalModal]);

    const handleSaveProgress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampagne) return;
        setCampagnes(prev => prev.map(c => {
            if (c.id === selectedCampagne.id) {
                return {
                    ...c,
                    progress: c.progress.map(p => p.establishment === user.establishment ? { ...p, achieved: reportValue } : p)
                };
            }
            return c;
        }));
        closeReportModal();
    };
    
    const handleSaveCampaign = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCampaign: Campagne = {
            id: 'CAMP' + String(campagnes.length + 1).padStart(2, '0'),
            nom: formData.get('nom') as string,
            type: formData.get('type') as Campagne['type'],
            coordinatingBody: user.establishment,
            dateDebut: formData.get('dateDebut') as string,
            dateFin: formData.get('dateFin') as string,
            status: 'Planifiée',
            progress: formProgress.filter(p => p.establishment && p.target && p.target > 0) as CampaignProgress[],
            targetPopulation: formProgress.reduce((sum, p) => sum + (p.target || 0), 0),
        };
        setCampagnes(prev => [newCampaign, ...prev]);
        closeFormModal();
    };

    const handleProgressChange = (index: number, field: 'establishment' | 'target', value: string | number) => {
        const newProgress = [...formProgress];
        const item = newProgress[index];
        if(field === 'establishment') item.establishment = value as string;
        if(field === 'target') item.target = Number(value);
        setFormProgress(newProgress);
    };

    const addProgressLine = () => setFormProgress([...formProgress, { establishment: '', target: 0, achieved: 0 }]);
    const removeProgressLine = (index: number) => setFormProgress(formProgress.filter((_, i) => i !== index));

    const userVisibleData = useMemo(() => {
        if (isSupervisor) return campagnes;
        return campagnes.filter(c => c.progress.some(p => p.establishment === user.establishment));
    }, [campagnes, user, isSupervisor]);

    const filteredData = useMemo(() => {
        return userVisibleData.filter(c =>
            c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [userVisibleData, searchTerm]);

    const stats = useMemo(() => ({
        enCours: userVisibleData.filter(c => c.status === 'En cours').length,
        planifiees: userVisibleData.filter(c => c.status === 'Planifiée').length,
        terminees: userVisibleData.filter(c => c.status === 'Terminée').length,
    }), [userVisibleData]);
    
    const renderSupervisorView = () => {
        const tableHeaders = ["Campagne", "Coordinateur", "Progression Globale", "Statut", "Actions"];
        const tableData = filteredData.map(c => {
            const totalAchieved = c.progress.reduce((sum, p) => sum + p.achieved, 0);
            const totalTarget = c.progress.reduce((sum, p) => sum + p.target, 0);
            const globalProgress = totalTarget > 0 ? totalAchieved / totalTarget : 0;
            return [
                c.nom, c.coordinatingBody, <ProgressBar value={globalProgress} />,
                <Badge color={statusColors[c.status]} text={c.status} />,
                <div className="flex items-center space-x-2">
                    <button onClick={() => viewEvaluation(c)} className="text-blue-500 hover:text-blue-700 p-1" title="Détails & Évaluation"><EyeIcon className="w-5 h-5" /></button>
                    <button className="text-yellow-500 hover:text-yellow-700 p-1"><PencilIcon className="w-5 h-5" /></button>
                </div>
            ];
        });
        return (
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Suivi des campagnes</h3>
                    <div className="flex items-center space-x-4">
                        <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher une campagne..." />
                        <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Planifier une campagne
                        </button>
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>
        );
    };

    const renderOperationalView = () => {
        const tableHeaders = ["Campagne", "Coordinateur", "Votre Objectif", "Votre Progression", "Actions"];
        const tableData = filteredData.map(c => {
            const myProgress = c.progress.find(p => p.establishment === user.establishment);
            if (!myProgress) return null;
            const progressValue = myProgress.target > 0 ? myProgress.achieved / myProgress.target : 0;
            return [
                c.nom, c.coordinatingBody, myProgress.target.toLocaleString('fr-FR'),
                <ProgressBar value={progressValue} />,
                <button onClick={() => handleReportProgress(c)} className="flex items-center text-sm text-white bg-primary hover:bg-primary-700 px-3 py-1 rounded-md">
                    <MegaphoneIcon className="w-4 h-4 mr-2" />
                    Rapporter
                </button>
            ];
        }).filter(Boolean);
        return (
             <Card>
                <h3 className="text-xl font-semibold mb-4">Campagnes impliquant {user.establishment}</h3>
                <Table headers={tableHeaders} data={tableData as (string | React.ReactNode)[][]} />
            </Card>
        );
    };

    const totalTargetPopulation = useMemo(() => {
        return formProgress.reduce((sum, p) => sum + (p.target || 0), 0);
    }, [formProgress]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion des Campagnes de Santé Publique</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Campagnes en cours" value={stats.enCours} icon={<MegaphoneIcon className="w-8 h-8"/>} color="text-blue-500"/>
                <StatsCard title="Campagnes planifiées" value={stats.planifiees} icon={<ClockIcon className="w-8 h-8"/>} color="text-yellow-500"/>
                <StatsCard title="Campagnes terminées" value={stats.terminees} icon={<CheckCircleIcon className="w-8 h-8"/>} color="text-green-500"/>
            </div>

            {isSupervisor ? renderSupervisorView() : renderOperationalView()}

            <Modal isOpen={isFormOpen} onClose={closeFormModal} title={selectedCampagne ? "Modifier la campagne" : "Planifier une nouvelle campagne"}>
                <form onSubmit={handleSaveCampaign} className="space-y-4">
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium">Nom de la campagne</label>
                        <input type="text" name="nom" id="nom" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium">Type</label>
                            <select name="type" id="type" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="Vaccination">Vaccination</option>
                                <option value="Sensibilisation">Sensibilisation</option>
                                <option value="Dépistage">Dépistage</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="coordinatingBody" className="block text-sm font-medium">Organisme Coordinateur</label>
                            <input type="text" name="coordinatingBody" id="coordinatingBody" value={user.establishment} readOnly className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dateDebut" className="block text-sm font-medium">Date de début</label>
                            <input type="date" name="dateDebut" id="dateDebut" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="dateFin" className="block text-sm font-medium">Date de fin</label>
                            <input type="date" name="dateFin" id="dateFin" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div className="border-t pt-4">
                         <h4 className="text-md font-medium mb-2">Participants et Objectifs</h4>
                         <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {formProgress.map((progress, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select value={progress.establishment} onChange={(e) => handleProgressChange(index, 'establishment', e.target.value)} className="flex-grow border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                        <option value="">-- Sélectionner un établissement --</option>
                                        {allEstablishmentsForPlanning.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                    <input type="number" placeholder="Cible" value={progress.target || ''} onChange={(e) => handleProgressChange(index, 'target', e.target.value)} className="w-32 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                                    <button type="button" onClick={() => removeProgressLine(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))}
                         </div>
                         <button type="button" onClick={addProgressLine} className="mt-2 flex items-center text-sm text-primary hover:underline"><PlusIcon className="w-4 h-4 mr-1" />Ajouter un participant</button>
                    </div>

                    <div className="text-right border-t pt-2">
                        <span className="text-sm font-bold">Population Cible Totale: </span>
                        <span className="text-lg font-extrabold ml-2 text-primary">{totalTargetPopulation.toLocaleString('fr-FR')}</span>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeFormModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">Enregistrer la campagne</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isReportOpen} onClose={closeReportModal} title={`Rapporter la progression pour ${user.establishment}`}>
                <form onSubmit={handleSaveProgress} className="space-y-4">
                    <h4 className="font-semibold">{selectedCampagne?.nom}</h4>
                    <div>
                        <label htmlFor="achieved" className="block text-sm font-medium">Nombre de personnes atteintes (sur {selectedCampagne?.progress.find(p=>p.establishment===user.establishment)?.target})</label>
                        <input type="number" name="achieved" id="achieved" value={reportValue} onChange={e => setReportValue(Number(e.target.value))} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeReportModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">Enregistrer</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isEvalOpen} onClose={closeEvalModal} title={`Évaluation de la campagne: ${selectedCampagne?.nom}`}>
                {selectedCampagne && (
                    <div className="space-y-4">
                        {selectedCampagne.progress.map(p => {
                            const progressValue = p.target > 0 ? p.achieved / p.target : 0;
                            return (
                                <div key={p.establishment}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h5 className="font-semibold">{p.establishment}</h5>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{p.achieved.toLocaleString('fr-FR')} / {p.target.toLocaleString('fr-FR')}</span>
                                    </div>
                                    <ProgressBar value={progressValue} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CampagnesPage;
