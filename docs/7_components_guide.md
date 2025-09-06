# 7. Guide des Composants

Cette section fournit une documentation pour les composants React clés de l'application. Comprendre le rôle et les `props` de ces composants est essentiel pour maintenir et étendre l'interface utilisateur.

## 7.1. Composants d'UI Génériques (`src/components/ui/`)

Ces composants sont les briques de base de l'interface. Ils sont conçus pour être réutilisables, configurables et purement présentationnels.

### `Card.tsx`
Un conteneur stylisé pour regrouper du contenu.
-   **Rôle** : Fournir un style cohérent (fond blanc, ombre, coins arrondis) pour les blocs de contenu.
-   **Props** :
    -   `children: React.Node`: Le contenu à afficher à l'intérieur de la carte.
    -   `className?: string`: Classes Tailwind CSS supplémentaires pour personnaliser le style.

### `Table.tsx`
Affiche des données tabulaires de manière cohérente.
-   **Rôle** : Rendre un tableau HTML stylisé. Il est capable d'afficher des chaînes de caractères, des nombres ou même d'autres composants React (comme des `Badge` ou des boutons) dans ses cellules.
-   **Props** :
    -   `headers: string[]`: Un tableau de chaînes pour les en-têtes de colonne.
    -   `data: (string | React.Node)[][]`: Un tableau de tableaux, où chaque tableau enfant représente une ligne (`<tr>`).

### `Modal.tsx`
Une fenêtre modale accessible pour les formulaires et les alertes.
-   **Rôle** : Fournir une superposition qui bloque l'interaction avec le reste de la page. Elle est accessible au clavier (fermeture avec `Escape`, gestion du focus).
-   **Props** :
    -   `isOpen: boolean`: Contrôle la visibilité de la modale.
    -   `onClose: () => void`: Fonction appelée pour fermer la modale.
    -   `title: string`: Le titre affiché dans l'en-tête de la modale.
    -   `children: React.Node`: Le contenu du corps de la modale (généralement un formulaire).

### `Badge.tsx`
Affiche un petit badge coloré pour les statuts.
-   **Rôle** : Indiquer visuellement un statut (ex: "Actif", "Critique").
-   **Props** :
    -   `text: string`: Le texte à afficher.
    -   `color: 'green' | 'yellow' | 'red' | 'blue'`: Le nom de la couleur, qui est mappé à des classes Tailwind.

### `SearchInput.tsx`
Un champ de recherche stylisé avec une icône.
-   **Rôle** : Fournir une interface de recherche cohérente. C'est un composant contrôlé.
-   **Props** :
    -   `value: string`: La valeur actuelle du champ.
    -   `onChange: (e) => void`: Callback appelé lorsque la valeur change.
    -   `placeholder?: string`: Texte d'aide.

### `ToggleSwitch.tsx`
Un interrupteur pour les valeurs booléennes.
-   **Rôle** : Permettre d'activer/désactiver une option de manière intuitive.
-   **Props** :
    -   `enabled: boolean`: L'état actuel de l'interrupteur.
    -   `onChange: (enabled: boolean) => void`: Callback appelé lors du changement d'état.

## 7.2. Composants de Layout (`src/components/layout/`)

Ces composants définissent la structure visuelle principale de l'application.

### `DashboardLayout.tsx`
L'enveloppe principale de l'application après la connexion.
-   **Rôle** : Orchestre l'affichage du `Sidebar`, du `Header` et du contenu de la page active. Il gère également l'état des notifications et le routage simulé (`activePage`).

### `Sidebar.tsx`
La barre de navigation latérale.
-   **Rôle** : Affiche les liens de navigation principaux. Son contenu est généré dynamiquement en fonction du rôle de l'utilisateur (`user.role`), constituant un élément clé du RBAC.

### `Header.tsx`
L'en-tête de l'application.
-   **Rôle** : Affiche des informations sur l'utilisateur connecté, son établissement, et fournit l'accès au panneau de notifications et au bouton de déconnexion.

## 7.3. Composants de Page (`src/components/pages/`)

Chaque fichier dans ce répertoire représente une vue principale de l'application.

### `ConsultationsPage.tsx`
Un exemple de page complexe avec une logique RBAC avancée.
-   **Rôle** : Gère tout ce qui concerne les consultations. Affiche différentes vues et fonctionnalités selon que l'utilisateur est un superviseur national, un administrateur local ou un agent de saisie.

### `SurveillanceRAMPage.tsx`
Un module de santé publique pour le suivi de la résistance aux antimicrobiens.
-   **Rôle** : Gère la déclaration et la consultation des cas de RAM. Il implémente une logique RBAC où les établissements opérationnels saisissent les données, et les superviseurs (notamment l'INRSP) ont une vue nationale consolidée avec des cartes statistiques et des filtres avancés (par établissement, service, spécialité, etc.) pour l'analyse.

### `CampagnesPage.tsx`
Un module de coordination pour les campagnes de santé publique.
-   **Rôle** : Permet la planification, le suivi et l'évaluation des campagnes. Les superviseurs peuvent planifier des campagnes, définir des objectifs par établissement et suivre la progression globale. Les agents de terrain peuvent consulter les campagnes qui les concernent et rapporter leur progression via un modal dédié.

### `ReferencementsPage.tsx`
Un module pour la coordination des soins inter-établissements.
-   **Rôle** : Gère le flux de référencement et de contre-référencement. Les agents de terrain peuvent initier des demandes et mettre à jour le statut des demandes reçues. Les superviseurs ont une vue d'ensemble avec des statistiques et des filtres avancés pour analyser les flux de patients. Un modal permet de visualiser l'historique complet d'un référencement.

### Pages d'Administration (`src/components/pages/admin/`)
Ces pages sont conçues pour être utilisées par les `SUPER_ADMIN` et `ADMIN_LOCAL`.
-   **Rôle** : Elles partagent une structure similaire : une liste de données (utilisateurs, services, etc.) affichée dans un tableau, avec des capacités de recherche, de filtrage, d'ajout et de modification. La logique de filtrage et la visibilité des données sont fortement dépendantes du rôle de l'utilisateur.

### `ModulesPage.tsx`
Le centre de contrôle de la plateforme pour les Super Administrateurs.
-   **Rôle** : Affiche un tableau matriciel permettant d'activer ou de désactiver des modules fonctionnels (comme la Facturation, la Pharmacie, etc.) pour chaque établissement pilote. Cette page utilise le composant `ToggleSwitch` pour une gestion intuitive des permissions.

## 7.4. Hooks Personnalisés (`src/hooks/`)

### `useModal.ts`
Simplifie la gestion de l'état des modaux.
-   **Rôle** : Abstrait la logique `useState` pour contrôler un modal.
-   **Retourne** : Un objet `{ isOpen, openModal, closeModal }`, rendant le code des composants de page plus propre et plus lisible.