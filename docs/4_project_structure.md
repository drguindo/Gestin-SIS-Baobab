# 4. Structure du Projet

L'organisation des fichiers et des dossiers est conçue pour être intuitive et évolutive. Elle suit les conventions établies dans l'écosystème React/TypeScript pour faciliter la maintenance et l'intégration de nouveaux développeurs.

## 4.1. Arborescence du Projet

```plaintext
/
├── public/                     # Fichiers statiques (icônes, etc.)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx   # Composant pour la page de connexion/sélection de profil.
│   │   ├── dashboard/          # Composants spécifiques au tableau de bord principal.
│   │   │   ├── ConsultationsChart.tsx
│   │   │   ├── EpidemiologyChart.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── layout/             # Composants de mise en page (header, sidebar).
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationsPanel.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── pages/              # Composants représentant des pages complètes.
│   │   │   ├── admin/          # Pages spécifiques à l'administration.
│   │   │   │   ├── DataSharingPage.tsx
│   │   │   │   ├── EtablissementsPage.tsx
│   │   │   │   ├── ModulesPage.tsx
│   │   │   │   ├── ServicesPage.tsx
│   │   │   │   ├── SpecialitesPage.tsx
│   │   │   │   └── UtilisateursPage.tsx
│   │   │   ├── ConsultationsPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EpidemiologiePage.tsx
│   │   │   ├── FacturationPage.tsx
│   │   │   ├── HospitalisationsPage.tsx
│   │   │   ├── PatientsPage.tsx
│   │   │   ├── RapportsPage.tsx
│   │   │   ├── ReferencementsPage.tsx
│   │   │   └── RessourcesPage.tsx
│   │   └── ui/                 # Composants d'UI génériques et réutilisables.
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── SearchInput.tsx
│   │       ├── Table.tsx
│   │       ├── ToggleSwitch.tsx
│   │       └── icons.tsx       # Collection d'icônes SVG.
│   ├── docs/                   # Documentation complète du projet.
│   │   ├── 1_introduction.md
│   │   ├── ... (autres fichiers .md) ...
│   ├── hooks/
│   │   └── useModal.ts         # Hook personnalisé pour gérer l'état des modaux.
│   ├── App.tsx                 # Composant racine de l'application.
│   ├── index.css               # Styles globaux (si nécessaire).
│   ├── index.tsx               # Point d'entrée de l'application React.
│   └── types.ts                # Définitions des types TypeScript globaux.
│
├── .gitignore                  # Fichiers et dossiers ignorés par Git.
├── index.html                  # Fichier HTML principal, point d'entrée de la SPA.
├── package.json                # Dépendances et scripts du projet.
├── README.md                   # README principal du projet.
└── tsconfig.json               # Configuration du compilateur TypeScript.
```

## 4.2. Description des Dossiers Clés

-   **`src/`**: Contient tout le code source de l'application.
    -   **`components/`**: Le cœur de l'interface utilisateur. Il est subdivisé par fonctionnalité ou type de composant pour une meilleure organisation.
        -   `auth/`: Composants liés à l'authentification.
        -   `dashboard/`: Composants spécifiques à la page du tableau de bord principal.
        -   `layout/`: Composants qui structurent la mise en page générale de l'application.
        -   `pages/`: Composants "intelligents" qui représentent une vue ou une page complète de l'application. La logique métier principale y réside. Le sous-dossier `admin/` regroupe les pages réservées aux administrateurs.
        -   `ui/`: Une bibliothèque de composants de présentation ("dumb components") réutilisables dans toute l'application. Ces composants sont conçus pour être génériques et configurables via leurs `props`.
    -   **`docs/`**: Contient cette documentation technique structurée au format Markdown.
    -   **`hooks/`**: Contient les hooks React personnalisés qui encapsulent une logique réutilisable (par exemple, la gestion de l'état d'un modal).
-   **`src/App.tsx`**: Le composant racine. Il gère l'état d'authentification et agit comme un aiguilleur principal, affichant soit la page de connexion, soit le tableau de bord principal.
-   **`src/index.tsx`**: Le point d'entrée JavaScript/TypeScript. C'est ici que l'application React est "montée" dans le DOM du fichier `index.html`.
-   **`src/types.ts`**: Un fichier centralisé pour toutes les définitions de types et d'interfaces TypeScript. Avoir un modèle de données centralisé améliore la cohérence et la maintenabilité.
-   **`public/`**: Contient les ressources statiques qui ne sont pas traitées par le processus de build, comme le `favicon`.
-   **`index.html`**: La seule et unique page HTML de l'application. Le contenu de la balise `<div id="root"></div>` est géré par React. C'est également ici que la configuration de Tailwind CSS et la carte d'importation (importmap) pour les dépendances CDN sont définies.
