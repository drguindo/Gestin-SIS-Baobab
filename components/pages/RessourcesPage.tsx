import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import StatsCard from '../dashboard/StatsCard';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { BedIcon, WrenchScrewdriverIcon, CogIcon } from '../ui/icons';
import SearchInput from '../ui/SearchInput';

const RessourcesPage: React.FC = () => {
    const [bedsSearchTerm, setBedsSearchTerm] = useState('');
    const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');

    const bedsTableHeaders = ["Service", "Total Lits", "Occupés", "Disponibles", "Taux d'occupation"];
    const bedsTableData = useMemo(() => [
        ["Chirurgie", 30, 25, 5, "83%"],
        ["Pédiatrie", 20, 18, 2, "90%"],
        ["Médecine Interne", 40, 32, 8, "80%"],
        ["Maternité", 15, 10, 5, "67%"],
        ["Cardiologie", 15, 10, 5, "67%"],
    ], []);

    const equipmentTableHeaders = ["Équipement", "ID", "Service", "Statut", "Prochaine maintenance"];
    const equipmentTableData = useMemo(() => [
        ["Électrocardiogramme (ECG)", "ECG-01", "Cardiologie", <Badge color="green" text="Actif" />, "01/09/2024"],
        ["Défibrillateur", "DEF-03", "Urgence", <Badge color="green" text="Actif" />, "15/08/2024"],
        ["Respirateur artificiel", "VENT-05", "Réanimation", <Badge color="yellow" text="En maintenance" />, "N/A"],
        ["Appareil de radiographie", "XRAY-02", "Radiologie", <Badge color="red" text="Hors service" />, "N/A"],
        ["Échographe", "ECHO-01", "Maternité", <Badge color="green" text="Actif" />, "20/09/2024"],
    ], []);

    const filteredBedsData = useMemo(() => {
        if (!bedsSearchTerm) return bedsTableData;
        return bedsTableData.filter(row =>
            (row[0] as string).toLowerCase().includes(bedsSearchTerm.toLowerCase())
        );
    }, [bedsSearchTerm, bedsTableData]);

    const filteredEquipmentData = useMemo(() => {
        if (!equipmentSearchTerm) return equipmentTableData;
        return equipmentTableData.filter(row =>
            (row[0] as string).toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
            (row[1] as string).toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
            (row[2] as string).toLowerCase().includes(equipmentSearchTerm.toLowerCase())
        );
    }, [equipmentSearchTerm, equipmentTableData]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Gestion des Ressources</h2>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard 
                    title="Lits disponibles" 
                    value="35"
                    icon={<BedIcon className="w-8 h-8"/>}
                    color="text-blue-500"
                />
                <StatsCard 
                    title="Équipements actifs" 
                    value="48"
                    icon={<CogIcon className="w-8 h-8"/>}
                    color="text-green-500"
                />
                <StatsCard 
                    title="Maintenance requise" 
                    value="3"
                    icon={<WrenchScrewdriverIcon className="w-8 h-8"/>}
                    color="text-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Gestion des lits</h3>
                        <SearchInput 
                            value={bedsSearchTerm}
                            onChange={(e) => setBedsSearchTerm(e.target.value)}
                            placeholder="Rechercher par service..."
                        />
                    </div>
                    <Table headers={bedsTableHeaders} data={filteredBedsData} />
                </Card>
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Gestion des équipements</h3>
                        <SearchInput 
                            value={equipmentSearchTerm}
                            onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                            placeholder="Rechercher par équipement, ID ou service..."
                        />
                    </div>
                    <Table headers={equipmentTableHeaders} data={filteredEquipmentData} />
                </Card>
            </div>
        </div>
    );
};

export default RessourcesPage;
