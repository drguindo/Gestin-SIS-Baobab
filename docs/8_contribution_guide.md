# 8. Guide de Contribution et de Maintenance

Ce guide s'adresse aux développeurs qui souhaitent maintenir ou étendre les fonctionnalités de l'application. Suivre ces directives garantira la cohérence et la qualité du code.

## 8.1. Philosophie et Conventions

-   **TypeScript Partout** : Tout le code JavaScript doit être écrit en TypeScript. Utilisez des types et des interfaces explicites pour les props des composants, les états et les structures de données.
-   **Composants Fonctionnels et Hooks** : Utilisez exclusivement des composants fonctionnels avec des hooks. Les composants de classe sont considérés comme obsolètes dans ce projet.
-   **Documentation du Code (JSDoc)** : Commentez tous les composants, fonctions, types et interfaces en utilisant la syntaxe JSDoc. Cela est crucial pour la maintenance et la génération de documentation automatique.
-   **Modularité** : Séparez clairement la logique (composants de page) de la présentation (composants UI). Créez des composants réutilisables chaque fois que possible.
-   **Immutabilité** : Ne mutez jamais directement l'état. Utilisez toujours les fonctions de mise à jour de `useState` (par exemple, `setItems(prev => [...prev, newItem])`) pour créer de nouvelles instances de l'état.

## 8.2. Ajouter une Nouvelle Page de Gestion

Suivez cette procédure pour ajouter une nouvelle page (par exemple, une page pour gérer les "Prescriptions").

1.  **Définir le Type de Données** :
    -   Allez dans `src/types.ts` et ajoutez une nouvelle interface, par exemple `Prescription`.

    ```typescript
    export interface Prescription {
      id: string;
      patientId: string;
      medication: string;
      // ... autres champs
    }
    ```

2.  **Créer le Composant de Page** :
    -   Créez un nouveau fichier `src/components/pages/PrescriptionsPage.tsx`.
    -   Ce composant doit accepter `user: User` comme prop pour permettre la logique RBAC.
    -   Initialisez les données (simulées pour l'instant) dans un état local : `const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);`.
    -   Utilisez le hook `useModal` pour gérer le modal d'ajout/modification : `const { isOpen, openModal, closeModal } = useModal();`.

3.  **Construire l'Interface** :
    -   Utilisez les composants réutilisables de `src/components/ui/` (`Card`, `Table`, `SearchInput`, `Modal`).
    -   Implémentez la logique de recherche et de filtrage avec `useMemo`.
    -   Créez le formulaire à l'intérieur du composant `Modal` pour ajouter ou modifier une prescription.

4.  **Implémenter la Logique CRUD** :
    -   Créez les fonctions `handleSave`, `handleDelete`, `openEditModal` à l'intérieur de votre composant de page. Ces fonctions doivent mettre à jour l'état `prescriptions`.

5.  **Intégrer la Page dans l'Application** :
    -   **Ajouter le lien de navigation** : Dans `src/components/layout/Sidebar.tsx`, ajoutez le nouvel item de menu dans les tableaux `roleLinks` pour les rôles appropriés.
    -   **Ajouter la "route"** : Dans `src/components/layout/DashboardLayout.tsx`, ajoutez un nouveau `case` dans l'instruction `switch` de la fonction `renderContent` pour afficher votre `PrescriptionsPage`.

    ```typescript
    // Dans DashboardLayout.tsx
    case 'Prescriptions':
      return <PrescriptionsPage user={user} />;
    ```

## 8.3. Mises à Jour Futures et Évolutions Possibles

Ce prototype constitue une base solide. Voici quelques axes d'amélioration pour une version de production :

-   **Intégration d'un Backend** : Remplacer les données simulées par des appels à une API REST ou GraphQL. La logique de récupération de données pourrait être encapsulée dans des hooks personnalisés (par exemple, `useFetchPrescriptions`).
-   **Bibliothèque de Routage** : Remplacer le système de routage basé sur l'état par une bibliothèque standard comme `react-router-dom` pour une gestion plus robuste des URL, de l'historique de navigation et des routes imbriquées.
-   **Gestion d'État Globale** : Si l'application se complexifie, l'introduction d'une bibliothèque comme `Zustand` ou `Redux Toolkit` pourrait être envisagée pour gérer l'état partagé de manière plus efficace que le "prop drilling".
-   **Tests Unitaires et d'Intégration** : Mettre en place une stratégie de tests avec des outils comme `Jest` et `React Testing Library` pour garantir la non-régression et la fiabilité du code.
-   **Internationalisation (i18n)** : Intégrer une bibliothèque comme `i18next` pour permettre la traduction de l'interface en plusieurs langues (français, anglais, langues locales).
