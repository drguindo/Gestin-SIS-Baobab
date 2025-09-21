/**
 * @file Contient le composant pour la page de gestion des ressources.
 * Cette page affiche des informations sur les lits d'hôpital et les équipements médicaux.
 */

import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import StatsCard from '../dashboard/StatsCard';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { BedIcon, WrenchScrewdriverIcon, CogIcon } from '../ui/icons';
import SearchInput from '../ui/SearchInput';

/**
 * La page de gestion des ressources de l'hôpital.
 * Elle fournit un aperçu de la disponibilité des lits et de l'état des équipements.
 * Des fonctionnalités de recherche sont disponibles pour chaque tableau.
 * Les données sont actuellement simulées.
 *
 * @returns {React.ReactElement} La page de gestion des ressources.
 */
const RessourcesPage: React.FC = () => {
    /** État pour le terme de recherche dans le tableau des lits. */
    const [bedsSearchTerm, setBedsSearchTerm] = useState('');
    /** État pour le terme de recherche dans le tableau des équipements. */
    const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');

    /** En-têtes pour le tableau de gestion des lits. */
    const bedsTableHeaders = ["Service", "Total Lits", "Occupés", "Disponibles", "Taux d'occupation"];
    /** Données simulées pour la gestion des lits. */
    const bedsTableData = useMemo(() => [
        ["Chirurgie", 30, 25, 5, "83%"],
        ["Pédiatrie", 20, 18, 2, "90%"],
        ["Médecine Interne", 40, 32, 8, "80%"],
        ["Maternité", 15, 10, 5, "67%"],
        ["Cardiologie", 15, 10, 5, "67%"],
    ], []);

    /** En-têtes pour le tableau de gestion des équipements. */
    const equipmentTableHeaders = ["Équipement", "ID", "Service", "Statut", "Prochaine maintenance"];
    /** Données simulées pour la gestion des équipements. */
    const equipmentTableData = useMemo(() => [
        ["Électrocardiogramme (ECG)", "ECG-01", "Cardiologie", <Badge color="green" text="Actif" />, "01/09/2024"],
        ["Défibrillateur", "DEF-03", "Urgence", <Badge color="green" text="Actif" />, "15/08/2024"],
        ["Respirateur artificiel", "VENT-05", "Réanimation", <Badge color="yellow" text="En maintenance" />, "N/A"],
        ["Appareil de radiographie", "XRAY-02", "Radiologie", <Badge color="red" text="Hors service" />, "N/A"],
        ["Échographe", "ECHO-01", "Maternité", <Badge color="green" text="Actif" />, "20/09/2024"],
    ], []);

    /** Filtre les données des lits en fonction du terme de recherche. */
    const filteredBedsData = useMemo(() => {
        if (!bedsSearchTerm) return bedsTableData;
        return bedsTableData.filter(row =>
            (row[0] as string).toLowerCase().includes(bedsSearchTerm.toLowerCase())
        );
    }, [bedsSearchTerm, bedsTableData]);

    /** Filtre les données des équipements en fonction du terme de recherche. */
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
