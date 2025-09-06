import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { EyeIcon, PencilIcon, PlusIcon } from '../ui/icons';
import SearchInput from '../ui/SearchInput';
import { useModal } from '../../hooks/useModal';

type Patient = {
    id: string;
    name: string;
    birthDate: string;
    gender: 'M' | 'F';
};

const initialPatients: Patient[] = [
    { id: "P001", name: "Moussa Traoré", birthDate: "15/05/1985", gender: "M" },
    { id: "P002", name: "Awa Diarra", birthDate: "22/11/1992", gender: "F" },
    { id: "P003", name: "Sidi Koné", birthDate: "03/01/2001", gender: "M" },
    { id: "P004", name: "Fatoumata Kéita", birthDate: "18/07/1988", gender: "F" },
    { id: "P005", name: "Ibrahim Diallo", birthDate: "30/09/1976", gender: "M" },
    { id: "P006", name: "Mariam Sangaré", birthDate: "09/02/2015", gender: "F" },
];

const PatientsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const { isOpen, openModal, closeModal } = useModal();

    const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPatient: Patient = {
            id: `P${String(patients.length + 1).padStart(3, '0')}`,
            name: formData.get('fullName') as string,
            birthDate: formData.get('birthDate') as string,
            gender: formData.get('gender') as 'M' | 'F',
        };
        setPatients(prev => [...prev, newPatient]);
        closeModal();
    };

    const tableHeaders = ["Patient ID", "Nom Complet", "Date de Naissance", "Sexe", "Actions"];
    
    const filteredData = useMemo(() => {
        if (!searchTerm) return patients;
        return patients.filter(patient =>
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, patients]);

    const tableData = filteredData.map(patient => [
        patient.id,
        patient.name,
        patient.birthDate,
        patient.gender,
        <div className="flex items-center space-x-2">
            <button className="text-primary hover:text-primary-700 p-1 rounded-md transition-colors duration-200" onClick={() => alert(`Visualisation du patient ${patient.id}`)}>
                <EyeIcon className="w-5 h-5" />
            </button>
            <button className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md transition-colors duration-200" onClick={() => alert(`Modification du patient ${patient.id}`)}>
                <PencilIcon className="w-5 h-5" />
            </button>
        </div>
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Patients</h2>
                 <button onClick={openModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter un patient
                </button>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Liste des patients enregistrés</h3>
                    <SearchInput 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par ID ou nom..."
                    />
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter un nouveau patient">
                <form onSubmit={handleAddPatient} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                        <input type="text" id="fullName" name="fullName" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de naissance</label>
                        <input type="date" id="birthDate" name="birthDate" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexe</label>
                        <select id="gender" name="gender" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
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

export default PatientsPage;
