/**
 * @file Contient le composant de la page de gestion des utilisateurs.
 * Permet aux administrateurs de voir, ajouter, et modifier les utilisateurs du système.
 */

import React, { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Table from '../../ui/Table';
import Badge from '../../ui/Badge';
import Modal from '../../ui/Modal';
import { PencilIcon, PlusIcon } from '../../ui/icons';
import SearchInput from '../../ui/SearchInput';
import { useModal } from '../../../hooks/useModal';
import { UserRole } from '../../../types';
import type { User as CurrentUser } from '../../../types';

/** Type définissant la structure d'un objet utilisateur pour la liste de gestion. */
type User = {
    name: string;
    role: UserRole;
    establishment: string;
    status: 'Actif' | 'Inactif';
};

/** Données simulées pour la liste des utilisateurs. */
const initialData: User[] = [
    { name: "Dr. Aminata Traoré", role: UserRole.SIH, establishment: "Hôpital Sominé Dolo", status: "Actif" },
    { name: "Moussa Diarra", role: UserRole.SIS_CSREF, establishment: "CSRéf de Djenné", status: "Actif" },
    { name: "Fatoumata Coulibaly", role: UserRole.SIS_CSCOM, establishment: "CSCOM de Sangha", status: "Actif" },
    { name: "Dr. Jean-Pierre Kante", role: UserRole.SIS_CABINET, establishment: "Cabinet Médical Étoile", status: "Actif" },
    { name: "Admin Local HSD", role: UserRole.ADMIN_LOCAL, establishment: "Hôpital Sominé Dolo", status: "Actif" },
    { name: "Admin Local CSRéf", role: UserRole.ADMIN_LOCAL, establishment: "CSRéf de Djenné", status: "Actif" },
    { name: "Utilisateur Test", role: UserRole.SIH, establishment: "Hôpital de Gao", status: "Inactif" },
];

const allEstablishments = [...new Set(initialData.map(u => u.establishment))];
const allRoles = Object.values(UserRole);

/** Props pour le composant UtilisateursPage. */
interface UtilisateursPageProps {
  /** L'utilisateur actuellement connecté. */
  user: CurrentUser;
}

/**
 * Page de gestion des utilisateurs du système.
 * Affiche une liste d'utilisateurs avec des options de filtrage avancées.
 * La visibilité des données est contrôlée par le rôle de l'utilisateur connecté.
 *
 * @param {UtilisateursPageProps} props - Les props du composant.
 * @returns {React.ReactElement} La page de gestion des utilisateurs.
 */
const UtilisateursPage: React.FC<UtilisateursPageProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>(initialData);
    const { isOpen, openModal, closeModal } = useModal();
    
    // États pour les filtres.
    const [establishmentFilter, setEstablishmentFilter] = useState(user.role === UserRole.SUPER_ADMIN ? 'all' : user.establishment);
    const [roleFilter, setRoleFilter] = useState('all');

    /** Gère l'ajout d'un nouvel utilisateur. */
    const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newUser: User = {
            name: formData.get('name') as string,
            role: formData.get('role') as UserRole,
            establishment: formData.get('establishment') as string,
            status: 'Actif',
        };
        setUsers(prev => [...prev, newUser]);
        closeModal();
    };

    /** Données de base visibles par l'utilisateur connecté. */
    const userVisibleData = useMemo(() => {
        if (user.role === UserRole.SUPER_ADMIN) {
            if (establishmentFilter === 'all') return users;
            return users.filter(u => u.establishment === establishmentFilter);
        }
        return users.filter(u => u.establishment === user.establishment);
    }, [user, users, establishmentFilter]);
    
    /** Données finales après application de tous les filtres. */
    const filteredData = useMemo(() => {
        return userVisibleData.filter(u =>
            (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             u.establishment.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'all' || u.role === roleFilter)
        );
    }, [searchTerm, roleFilter, userVisibleData]);

    const tableHeaders = ["Nom", "Rôle", "Établissement", "Statut", "Actions"];

    const tableData = filteredData.map(u => [
        u.name,
        u.role,
        u.establishment,
        <Badge color={u.status === 'Actif' ? 'green' : 'red'} text={u.status} />,
        <button onClick={openModal} className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md transition-colors duration-200">
            <PencilIcon className="w-5 h-5" />
        </button>
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestion des Utilisateurs</h2>
                <button onClick={openModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter un utilisateur
                </button>
            </div>

            <Card>
                 <div className="mb-4">
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                         {user.role === UserRole.SUPER_ADMIN ? "Liste de tous les utilisateurs" : `Utilisateurs de ${user.establishment}`}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {user.role === UserRole.SUPER_ADMIN && (
                            <div className="flex-grow">
                                <label htmlFor="establishment-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Établissement</label>
                                <select id="establishment-filter" value={establishmentFilter} onChange={e => setEstablishmentFilter(e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                    <option value="all">Tous les établissements</option>
                                    {allEstablishments.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex-grow">
                            <label htmlFor="role-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Rôle</label>
                            <select id="role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                                <option value="all">Tous les rôles</option>
                                {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex-grow">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                            <SearchInput 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par nom..."
                            />
                        </div>
                    </div>
                </div>
                <Table headers={tableHeaders} data={tableData} />
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter un Utilisateur">
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                        <input type="text" id="name" name="name" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rôle</label>
                        <select id="role" name="role" required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary">
                           {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="establishment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Établissement</label>
                         <input type="text" id="establishment" name="establishment" defaultValue={user.role !== UserRole.SUPER_ADMIN ? user.establishment : ''} required className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-primary focus:border-primary" />
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

export default UtilisateursPage;
