# 3. Guide de Maintenance Frontend (React)

## 3.1. Introduction

Ce guide est un manuel technique pour les développeurs travaillant sur le frontend de l'application SIS. Il couvre les conventions, les procédures communes et les meilleures pratiques pour assurer que le code reste propre, cohérent et facile à maintenir.

---

## 3.2. Procédures Courantes

### 3.2.1. Ajouter une Nouvelle Page

Pour ajouter une nouvelle page de gestion (ex: `PharmaciePage`):

1.  **Définir les Types de Données** :
    -   Dans `src/types.ts`, ajoutez les interfaces nécessaires (ex: `ProduitPharmaceutique`, `Stock`).

2.  **Créer le Fichier de la Page** :
    -   Créez `src/components/pages/PharmaciePage.tsx`.
    -   Le composant doit accepter `user: User` en `props` pour la logique RBAC.
    ```tsx
    import type { User } from '../../types';

    interface PharmaciePageProps {
      user: User;
    }

    const PharmaciePage: React.FC<PharmaciePageProps> = ({ user }) => {
      // ... logique de la page
    };

    export default PharmaciePage;
    ```

3.  **Intégrer la Page dans la Navigation** :
    -   **Dans `src/components/layout/Sidebar.tsx`** : Ajoutez le lien dans `roleLinks` pour les rôles autorisés.
        ```tsx
        [UserRole.SIH]: [
          // ... autres liens
          { name: 'Pharmacie', icon: <IconePharmacie /> },
        ],
        ```
    -   **Dans `src/components/layout/DashboardLayout.tsx`** : Ajoutez un `case` au `switch` dans la fonction `renderContent`.
        ```tsx
        const renderContent = () => {
          switch (activePage) {
            // ... autres cas
            case 'Pharmacie':
              return <PharmaciePage user={user} />;
            default:
              return <DashboardPage user={user} />;
          }
        };
        ```

### 3.2.2. Ajouter un Composant d'UI Réutilisable

Si vous créez un composant qui pourrait être utilisé ailleurs (ex: un sélecteur de date personnalisé) :

1.  **Créez le fichier dans `src/components/ui/`**, par exemple `DatePicker.tsx`.
2.  **Concevez-le pour être générique** : Le composant ne doit pas contenir de logique métier. Il reçoit toutes ses données et ses fonctions de rappel via ses `props`.
3.  **Utilisez des types TypeScript** pour définir clairement ses `props`.
4.  **Exportez-le** depuis le fichier et importez-le là où vous en avez besoin.

---

## 3.3. Gestion des Données

### 3.3.1. État Actuel : Données Simulées (Mock)

Actuellement, chaque page charge ses données depuis un tableau statique et les gère dans un état local avec `useState`.

```tsx
const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
```

Les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) modifient directement ce tableau en mémoire.

### 3.3.2. Transition vers une API Réelle

Pour connecter l'application à un backend, suivez ces étapes :

1.  **Créer une Couche de Service API** :
    -   Créez un fichier `src/services/api.ts`. Ce fichier centralisera la configuration de `fetch` (URL de base, en-têtes, gestion des tokens JWT).
    ```ts
    const API_URL = 'http://localhost:8000/api/v1'; // Ou depuis une variable d'environnement

    export const fetchConsultations = async (token: string): Promise<Consultation[]> => {
      const response = await fetch(`${API_URL}/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    };
    ```

2.  **Récupérer les Données dans les Pages** :
    -   Utilisez le hook `useEffect` pour appeler votre service API au chargement du composant.
    -   Ajoutez des états pour gérer le chargement (`loading`) et les erreurs (`error`).

    ```tsx
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadData = async () => {
        try {
          // Supposons que le token est stocké quelque part
          const data = await fetchConsultations(userToken);
          setConsultations(data);
        } catch (err) {
          setError('Erreur lors du chargement des données.');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, []); // Le tableau vide signifie que l'effet s'exécute une seule fois
    ```

3.  **Mettre à jour les Opérations CRUD** :
    -   Remplacez les modifications directes de l'état local par des appels API (ex: `createConsultation`, `deleteConsultation`).
    -   Après un appel réussi, mettez à jour l'état local pour refléter le changement sans avoir à recharger toute la page.

---

## 3.4. Logique d'Affichage Conditionnel (RBAC)

La logique RBAC est un pilier de l'application. Elle est implémentée via un rendu conditionnel basé sur `user.role` et `user.establishment`.

**Exemple concret dans `ConsultationsPage.tsx` :**

```tsx
// Affiche la vue de supervision si l'utilisateur a un rôle adéquat
{[UserRole.SUPER_ADMIN, UserRole.MINISTERE_SIS].includes(user.role) 
  ? renderSupervisorView() 
  : renderEstablishmentView()
}

// Affiche le bouton "Ajouter" uniquement pour les opérateurs
{isOperator && (
  <button onClick={openAddModal}>
    Ajouter
  </button>
)}
```

**Meilleures Pratiques :**
-   **Regroupez les rôles** : Utilisez des tableaux pour vérifier si un utilisateur appartient à un groupe de rôles (ex: `isSupervisor`).
-   **Soyez Explicite** : Le code doit être facile à lire pour comprendre qui a accès à quoi.
-   **Ne mettez jamais de données sensibles** dans le code frontend. La validation finale des permissions doit **TOUJOURS** être faite côté backend.
