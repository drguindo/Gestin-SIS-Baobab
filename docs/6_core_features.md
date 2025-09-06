# 6. Fonctionnalités Clés

Cette section détaille les mécanismes fondamentaux qui animent l'application, notamment le système de gestion des rôles, la gestion dynamique des données et le système de notifications.

## 6.1. Authentification et Gestion d'Accès Basée sur les Rôles (RBAC)

Le RBAC est au cœur de l'architecture de l'application. Il garantit que les utilisateurs ne peuvent voir et interagir qu'avec les données et les fonctionnalités pertinentes pour leur rôle.

### Mécanisme d'Implémentation

1.  **Connexion Simulée** : Dans `LoginPage.tsx`, l'utilisateur sélectionne un profil. Cette action déclenche le callback `onLogin` qui remonte l'objet `User` (contenant le `role` et l'`establishment`) au composant `App.tsx`.
2.  **Propagation des Données Utilisateur** : Le composant `App.tsx` stocke l'objet `user` dans son état et le propage à `DashboardLayout.tsx` et à toutes les pages actives via les `props`.
3.  **Rendu Conditionnel** : Les composants utilisent l'objet `user` reçu pour adapter leur affichage et leurs fonctionnalités :
    -   **Navigation (`Sidebar.tsx`)** : Le `Sidebar` utilise une structure de données (`roleLinks`) qui mappe chaque `UserRole` à un ensemble spécifique de liens de navigation. Seuls les liens autorisés pour le rôle de l'utilisateur actuel sont affichés.
    -   **Permissions de Page (`ConsultationsPage.tsx`, `UtilisateursPage.tsx`, etc.)** : Les pages implémentent une logique de rendu conditionnel complexe. Par exemple, un `SUPER_ADMIN` verra une vue agrégée de toutes les données avec un filtre par établissement, tandis qu'un `ADMIN_LOCAL` verra une vue détaillée restreinte à son propre établissement, et un agent `SIH` verra une interface de saisie de données.
    -   **Actions CRUD** : Les boutons "Ajouter", "Modifier", "Supprimer" ne sont affichés que si le rôle de l'utilisateur possède les permissions nécessaires (par exemple, un `MINISTERE_SIS` a un accès en lecture seule et ne verra pas ces boutons).

## 6.2. Gestion Dynamique des Données et CRUD

Pour simuler une application interactive, les données ne sont pas statiques. Chaque page de gestion de liste (patients, consultations, etc.) implémente un cycle de vie complet de gestion de données (CRUD : Create, Read, Update, Delete) au niveau du client.

### Mécanisme d'Implémentation

1.  **État Local avec `useState`** : Chaque page charge ses données simulées dans un état local (ex: `const [patients, setPatients] = useState(initialPatients)`). Cela permet au composant de se re-rendre lorsque les données changent.
2.  **Lecture et Filtrage (`useMemo`)** : Les données sont affichées dans un composant `Table`. La recherche et le filtrage sont implémentés en créant une nouvelle version filtrée des données à l'aide du hook `useMemo`. `useMemo` met en cache le résultat du filtrage et ne le recalcule que si les données brutes ou les termes du filtre changent, optimisant ainsi les performances.
3.  **Création et Mise à Jour via Modals (`useModal`)** :
    -   Les actions "Ajouter" ou "Modifier" ouvrent un composant `Modal`. Le hook personnalisé `useModal` est utilisé pour gérer l'état de visibilité du modal de manière propre.
    -   Le modal contient un formulaire pour la saisie des données.
    -   À la soumission du formulaire, la fonction de sauvegarde (`handleSave`, `handleAddPatient`, etc.) met à jour l'état de la liste de données (en ajoutant un nouvel élément ou en modifiant un élément existant).
    -   `setPatients(prev => [...prev, newPatient])`.
4.  **Suppression** : Un bouton de suppression déclenche une fonction qui filtre l'élément à supprimer de la liste de données, provoquant un nouveau rendu du tableau sans l'élément supprimé.

Ce cycle complet, bien que fonctionnant côté client, simule parfaitement le comportement d'une application connectée à une base de données.

## 6.3. Système de Notifications

L'application dispose d'un système de notifications pour alerter les utilisateurs d'événements importants.

### Mécanisme d'Implémentation

1.  **État Centralisé** : La liste des notifications (`notifications`) est gérée dans l'état du composant `DashboardLayout.tsx`. C'est le "propriétaire" de ces données.
2.  **Affichage dans le Header** : `DashboardLayout` passe la liste des notifications au composant `Header.tsx`. Le `Header` calcule le nombre de notifications non lues (`unreadCount`) et affiche un badge sur l'icône de cloche si ce nombre est supérieur à zéro.
3.  **Panneau de Notifications** :
    -   Un clic sur l'icône de cloche bascule l'état de visibilité du `NotificationsPanel.tsx`.
    -   Le `Header` passe également la liste complète des notifications et les fonctions de rappel (`onMarkAsRead`, `onMarkAllAsRead`) au `NotificationsPanel`.
4.  **Mise à Jour de l'État** : Lorsque l'utilisateur clique sur une notification ou sur "Tout marquer comme lu" dans le panneau, les fonctions de rappel sont appelées. Ces fonctions, définies dans `DashboardLayout.tsx`, mettent à jour l'état des notifications. La mise à jour de l'état dans `DashboardLayout` provoque un nouveau rendu des composants enfants (`Header`, `NotificationsPanel`), qui affichent alors l'état de lecture mis à jour.
