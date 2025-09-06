/**
 * @file Contient le composant de la page de gestion de la facturation.
 * Ce module est conçu pour les cabinets privés, leur permettant de créer et de suivre des factures.
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Facture, LigneFacture, Patient, ActeMedial } from '../../types';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useModal } from '../../hooks/useModal';
import SearchInput from '../ui/SearchInput';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, CreditCardIcon } from '../ui/icons';
import StatsCard from '../dashboard/StatsCard';
import Badge from '../ui/Badge';

// Données simulées
const mockPatients: Patient[] = [
    { id: "P001", name: "Moussa Traoré", birthDate: "1985-05-15", gender: "M", telephone: "76000001" },
    { id: "P002", name: "Awa Diarra", birthDate: "1992-11-22", gender: "F", telephone: "76000002" },
    { id: "P003", name: "Sidi Koné", birthDate: "2001-01-03", gender: "M", telephone: "76000003" },
    { id: "P004", name: "Fatoumata Kéita", birthDate: "1988-07-18", gender: "F", telephone: "76000004" },
    { id: "P005", name: "Ibrahim Diallo", birthDate: "1976-09-30", gender: "M", telephone: "76000005" },
    { id: "P006", name: "Mariam Sangaré", birthDate: "2015-02-09", gender: "F", telephone: "76000006" },
    { id: "P009", name: "Adama Koné", birthDate: "1980-01-01", gender: "M", telephone: "76000009"},
    { id: "P010", name: "Fanta Cissé", birthDate: "1990-02-02", gender: "F", telephone: "76000010"},
];

const mockActes: ActeMedial[] = [
    { id: 'ACT01', description: 'Consultation Générale', prix: 5000 },
    { id: 'ACT02', description: 'Consultation Spécialisée (Cardio)', prix: 15000 },
    { id: 'ACT03', description: 'Échographie', prix: 25000 },
    { id: 'ACT04', description: 'ECG', prix: 12000 },
    { id: 'ACT05', description: 'Bilan de santé annuel', prix: 35000 },
    { id: 'ACT06', description: 'Suture de plaie simple', prix: 7500 },
    { id: 'ACT07', description: 'Vaccination', prix: 3000 },
];

const mockFactures: Facture[] = [
    { id: 'F001', patientId: 'P009', patientName: 'Adama Koné', date: '2024-07-20', lignes: [{ id: 1, description: 'Consultation Cardiologie', montant: 15000 }], total: 15000, status: 'Payée', paymentMethod: 'Espèces' },
    { id: 'F002', patientId: 'P010', patientName: 'Fanta Cissé', date: '2024-07-19', lignes: [{ id: 1, description: 'Échographie de suivi', montant: 25000 }], total: 25000, status: 'Émise', paymentMethod: 'Mobile Money' },
];

const statusColors: { [key in Facture['status']]: 'yellow' | 'blue' | 'green' } = {
    "Brouillon": "yellow", "Émise": "blue", "Payée": "green"
};

const FacturationPage: React.FC = () => {
    const [factures, setFactures] = useState<Facture[]>(mockFactures);
    const [searchTerm, setSearchTerm] = useState('');
    const { isOpen, openModal, closeModal } = useModal();
    const patientSearchRef = useRef<HTMLDivElement>(null);

    // State pour le formulaire
    const [lignes, setLignes] = useState<LigneFacture[]>([{ id: Date.now(), description: '', montant: 0 }]);
    const [total, setTotal] = useState(0);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPatientListOpen, setPatientListOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<Facture['paymentMethod']>('Espèces');

    useEffect(() => {
        const newTotal = lignes.reduce((acc, ligne) => acc + Number(ligne.montant || 0), 0);
        setTotal(newTotal);
    }, [lignes]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (patientSearchRef.current && !patientSearchRef.current.contains(event.target as Node)) {
                setPatientListOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddLigne = () => setLignes([...lignes, { id: Date.now(), description: '', montant: 0 }]);
    const handleRemoveLigne = (id: number) => setLignes(lignes.filter(ligne => ligne.id !== id));

    const handleLigneChange = (id: number, field: 'description' | 'montant', value: string) => {
        setLignes(lignes.map(ligne => {
            if (ligne.id === id) {
                if (field === 'description') {
                    const selectedActe = mockActes.find(acte => acte.description === value);
                    return { ...ligne, description: value, montant: selectedActe ? selectedActe.prix : ligne.montant };
                }
                return { ...ligne, [field]: Number(value) };
            }
            return ligne;
        }));
    };

    const handleOpenModal = () => {
        setSelectedPatient(null);
        setPatientSearch('');
        setLignes([{ id: Date.now(), description: '', montant: 0 }]);
        setPaymentMethod('Espèces');
        openModal();
    };

    const handleSaveFacture = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) {
            alert("Veuillez sélectionner un patient.");
            return;
        }
        const newFacture: Facture = {
            id: 'F' + String(factures.length + 1).padStart(3, '0'),
            patientId: selectedPatient.id,
            patientName: selectedPatient.name,
            date: new Date().toISOString().split('T')[0],
            lignes: lignes.filter(l => l.description && l.montant > 0),
            total,
            status: 'Brouillon',
            paymentMethod,
        };
        setFactures(prev => [newFacture, ...prev]);
        closeModal();
    };
    
    const filteredPatients = useMemo(() => {
        if (!patientSearch) return [];
        const search = patientSearch.toLowerCase();
        return mockPatients.filter(p => 
            p.name.toLowerCase().includes(search) ||
            p.id.toLowerCase().includes(search) ||
            p.telephone.includes(search)
        );
    }, [patientSearch]);
    
    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setPatientSearch(patient.name);
        setPatientListOpen(false);
    };

    const filteredFactures = useMemo(() => factures.filter(f => f.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase())), [factures, searchTerm]);
    const stats = useMemo(() => ({
        totalEmis: factures.filter(f => f.status !== 'Brouillon').reduce((sum, f) => sum + f.total, 0),
        totalPaye: factures.filter(f => f.status === 'Payée').reduce((sum, f) => sum + f.total, 0),
        enAttente: factures.filter(f => f.status === 'Émise').length
    }), [factures]);

    const tableHeaders = ["Facture ID", "Patient", "Date", "Total", "Statut", "Actions"];
    const tableData = filteredFactures.map(facture => [
        facture.id, facture.patientName, facture.date, `${facture.total.toLocaleString('fr-FR')} XOF`,
        <Badge color={statusColors[facture.status]} text={facture.status} />,
        <div className="flex items-center space-x-2">
            <button className="text-primary hover:text-primary-700 p-1"><EyeIcon className="w-5 h-5" /></button>
            <button className="text-yellow-500 hover:text-yellow-700 p-1"><PencilIcon className="w-5 h-5" /></button>
        </div>
    ]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion de la Facturation</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Total Facturé" value={`${stats.totalEmis.toLocaleString('fr-FR')} XOF`} icon={<CreditCardIcon className="w-8 h-8"/>} color="text-blue-500"/>
                <StatsCard title="Total Encaissé" value={`${stats.totalPaye.toLocaleString('fr-FR')} XOF`} icon={<CreditCardIcon className="w-8 h-8"/>} color="text-green-500"/>
                <StatsCard title="Factures en Attente" value={stats.enAttente} icon={<CreditCardIcon className="w-8 h-8"/>} color="text-yellow-500"/>
            </div>

            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Liste des Factures</h3>
                    <div className="flex items-center space-x-4">
                        <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher par ID ou patient..." />
                        <button onClick={handleOpenModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Créer une Facture
                        </button>
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal} title="Créer une nouvelle facture">
                <form onSubmit={handleSaveFacture} className="space-y-4">
                    <div className="relative" ref={patientSearchRef}>
                        <label htmlFor="patientName" className="block text-sm font-medium">Rechercher un patient (Nom, ID, Tél.)</label>
                        <input type="text" id="patientName" value={patientSearch} 
                               onChange={e => { setPatientSearch(e.target.value); setPatientListOpen(true); setSelectedPatient(null); }} 
                               onFocus={() => setPatientListOpen(true)}
                               required autoComplete="off"
                               className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                        {isPatientListOpen && filteredPatients.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto">
                                {filteredPatients.map(p => (
                                    <li key={p.id} onClick={() => handleSelectPatient(p)} className="px-3 py-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900">
                                        {p.name} ({p.id} - {p.telephone})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
                        <h4 className="text-md font-medium mb-2">Lignes de la facture</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                           {lignes.map((ligne, index) => (
                                <div key={ligne.id} className="flex items-center space-x-2">
                                    <select value={ligne.description} onChange={e => handleLigneChange(ligne.id, 'description', e.target.value)} className="flex-grow border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                        <option value="">-- Sélectionner un acte --</option>
                                        {mockActes.map(acte => <option key={acte.id} value={acte.description}>{acte.description}</option>)}
                                    </select>
                                    <input type="number" placeholder="Montant" value={ligne.montant === 0 ? '' : ligne.montant} onChange={e => handleLigneChange(ligne.id, 'montant', e.target.value)} className="w-32 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm" />
                                    <button type="button" onClick={() => handleRemoveLigne(ligne.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                           ))}
                        </div>
                        <button type="button" onClick={handleAddLigne} className="mt-3 flex items-center text-sm text-primary hover:underline"><PlusIcon className="w-4 h-4 mr-1" />Ajouter une ligne</button>
                    </div>
                    
                     <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium">Mode de paiement</label>
                        <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as Facture['paymentMethod'])} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                            <option value="Espèces">Espèces</option>
                            <option value="Mobile Money">Mobile Money</option>
                            <option value="Assurance">Assurance</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>

                    <div className="text-right">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-xl font-extrabold ml-4 text-primary">{total.toLocaleString('fr-FR')} XOF</span>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700">Enregistrer la facture</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FacturationPage;