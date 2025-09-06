
# Documentation Technique - Gestion SIS Mali

## 1. Introduction

Ce document fournit une documentation technique complète pour le module de Système d'Information Sanitaire (SIS) pour la gestion hospitalière au Mali. L'application est une Single Page Application (SPA) construite avec React, TypeScript et Tailwind CSS, conçue pour être modulaire, performante et facile à maintenir.

### 1.1. Pile Technique

- **Framework** : React 19
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Librairie de graphiques** : Recharts
- **Hooks Personnalisés**: `useModal` pour la gestion des fenêtres modales

---

## 2. Structure du Projet

Le projet est organisé de manière logique pour séparer les préoccupations et faciliter la navigation dans le code.

```
/
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx         # Composant pour la page de connexion
│   ├── dashboard/
│   ├── layout/
│   ├── pages/
│   └── ui/
│       ├── Badge.tsx             # Composant badge coloré
│       ├── Card.tsx              # Composant carte générique
│       ├── Modal.tsx             # Composant modal générique pour les formulaires
│       ├── SearchInput.tsx       # Composant barre de recherche
│       ├── Table.tsx             # Composant tableau réutilisable
│       ├── ToggleSwitch.tsx      # Composant interrupteur
│       └── icons.tsx             # Collection d'icônes SVG
├── docs/
│   └── DOCUMENTATION.md          # Ce fichier de documentation
├── hooks/
│   └── useModal.ts               # Hook pour gérer l'état des modaux
├── App.tsx                       # Composant racine, gère l'état de connexion
├── index.html                    # Point d'entrée HTML
├── index.tsx                     # Point de montage de l'application React
├── metadata.json                 # Métadonnées de l'application
└── types.ts                      # Définitions des types TypeScript globaux
```

---

## 3. Fonctionnalités Clés

### 3.1. Authentification et Gestion des Rôles

- **Authentification simulée** : La connexion est actuellement simulée dans `LoginPage.tsx`.
- **Gestion des Rôles (RBAC)** : Le `Sidebar.tsx` adapte les liens de navigation en fonction du rôle de l'utilisateur. Un rôle `MINISTERE_SIS` a été ajouté pour la supervision nationale.

### 3.2. Pages de Gestion Dynamiques

- **Gestion d'état local** : Toutes les pages affichant des listes (Patients, Utilisateurs, etc.) utilisent désormais le hook `useState` pour gérer leurs données. Cela remplace les données statiques et permet une interaction dynamique.
- **Ajout et Modification via Modals** : Les actions d'ajout et de modification sont gérées via un composant `Modal.tsx` réutilisable. L'ajout d'un nouvel élément met à jour l'état de la page, et le tableau se rafraîchit instantanément pour afficher la nouvelle donnée.

### 3.3. Page de Consultations

Une nouvelle page `ConsultationsPage.tsx` a été ajoutée. C'est une page complexe avec un affichage conditionnel basé sur le rôle de l'utilisateur :
- **Vue Super Admin / Ministère** : Vue agrégée de toutes les consultations avec un filtre par établissement.
- **Vue Admin Local** : Tableau de bord détaillé de son établissement avec filtres par service, spécialité et médecin.
- **Vue Opérationnelle (SIH, CSCOM, Cabinet, etc.)** : Interface de saisie de données avec fonctionnalités CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les consultations de leur propre établissement.

### 3.4. Système de Notifications

- **Indicateur visuel** : Une icône de cloche (`BellIcon`) dans le `Header.tsx` affiche un badge avec le nombre de notifications non lues.
- **Panneau de notifications** : Un clic sur la cloche ouvre le `NotificationsPanel.tsx`, qui liste les notifications et permet de les marquer comme lues.
- **Gestion d'état centralisée** : L'état des notifications est géré dans `DashboardLayout.tsx`.

### 3.5. Recherche et Filtrage Avancé

- **Filtrage en temps réel** : La plupart des pages de listes sont équipées d'une barre de recherche (`SearchInput.tsx`) qui filtre les données du tableau instantanément côté client.
- **Filtrage par Rôle** : Les pages d'administration (`Utilisateurs`, `Services`, `Spécialités`) implémentent désormais un filtrage avancé basé sur les rôles :
  - **Super Admin** : A une vue globale sur toutes les données et dispose d'un filtre déroulant pour se concentrer sur un **établissement** spécifique.
  - **Admin Local** : Sa vue est automatiquement restreinte à son propre établissement. Il dispose de filtres contextuels supplémentaires (par rôle d'utilisateur, par unité de service, etc.) pour affiner les données.

---

## 4. Description des Composants Majeurs

### `App.tsx`

Le composant racine. Il gère l'état d'authentification (`currentUser`) et affiche soit `LoginPage`, soit `DashboardLayout`.

### `DashboardLayout.tsx`

Le conteneur principal post-connexion. Il gère l'agencement, le routage simple via `activePage`, et l'état des notifications. Il est également responsable de passer l'objet `user` aux pages enfants pour permettre le rendu conditionnel.

### `components/ui/`

Ce répertoire contient des composants d'interface utilisateur génériques et hautement réutilisables.

- **`Modal.tsx`** : Un composant essentiel pour l'application. Il fournit une fenêtre modale accessible (ARIA) et stylisée pour afficher des formulaires ou des informations sans quitter le contexte de la page actuelle.
- **`Card.tsx`, `Table.tsx`, `Badge.tsx`, `SearchInput.tsx`** : Composants de base pour construire l'interface de manière cohérente.

### `hooks/useModal.ts`

Un hook personnalisé qui abstrait la logique de gestion de l'état d'un modal. Il retourne un état `isOpen` et des fonctions pour `openModal` et `closeModal`, simplifiant ainsi l'utilisation des modaux dans les composants de page.

---

## 5. Style et Thème

- **Tailwind CSS** : L'ensemble de l'application est stylé avec Tailwind CSS. La configuration du thème est définie dans `index.html`.
- **Mode Sombre (Dark Mode)** : L'application prend en charge un mode sombre via les classes `dark:` de Tailwind.

---

## 6. Comment Contribuer ?

### 6.1. Ajouter une nouvelle page de gestion

1.  **Créer le composant de page** dans `components/pages/`. La page doit accepter `user` en tant que prop.
2.  **Implémenter la logique de vue conditionnelle** si la page doit s'adapter aux rôles.
3.  **Gérer les données avec `useState`** pour rendre le tableau dynamique.
4.  **Utiliser le hook `useModal`** pour gérer l'ouverture/fermeture du modal d'ajout/modification.
5.  **Implémenter le `<Modal>`** avec un formulaire pour la saisie des données.
6.  **Ajouter le lien dans `Sidebar.tsx`** et la logique d'affichage dans `DashboardLayout.tsx`.

### 6.2. Mises à Jour Futures

Ce document sera mis à jour continuellement pour refléter les nouvelles fonctionnalités et les changements d'architecture.