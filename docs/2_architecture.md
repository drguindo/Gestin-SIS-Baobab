# 2. Architecture Logicielle

Ce document décrit l'architecture de haut niveau de l'application SIS. L'architecture a été conçue pour être simple, évolutive et facile à maintenir, tout en respectant les meilleures pratiques du développement web moderne.

## 2.1. Vue d'ensemble : Single Page Application (SPA)

L'application est conçue comme une **Single Page Application (SPA)**. Cela signifie que l'intégralité de l'application est chargée une seule fois dans le navigateur. La navigation entre les différentes "pages" ou vues se fait ensuite dynamiquement côté client, sans nécessiter de rechargement complet de la page.

-   **Avantages** :
    -   **Expérience utilisateur fluide** : La navigation est quasi instantanée.
    -   **Performance** : Réduction de la charge sur le serveur, car seules les données nécessaires sont échangées via des API (simulées dans ce prototype).
    -   **Développement simplifié** : Le frontend est complètement découplé d'un potentiel backend.

## 2.2. Modèle de Composants React

L'interface utilisateur est construite selon un modèle de composants hiérarchiques, une caractéristique fondamentale de React. Les composants sont organisés de manière logique pour promouvoir la réutilisabilité et la séparation des préoccupations.

-   **Composants "Intelligents" (Pages)** : Situés dans `src/components/pages/`, ils sont responsables de la logique métier, de la gestion de l'état local de la page (données, filtres, état des modaux) et de la récupération des données. Exemples : `ConsultationsPage.tsx`, `UtilisateursPage.tsx`.
-   **Composants de Présentation ("Dumb")** : Situés dans `src/components/ui/`, ils sont réutilisables, reçoivent des données via leurs `props` et n'ont pas de logique métier propre. Leur seule responsabilité est d'afficher l'interface. Exemples : `Table.tsx`, `Card.tsx`, `Modal.tsx`.
-   **Composants de Layout** : Situés dans `src/components/layout/`, ils définissent la structure visuelle principale de l'application (barre latérale, en-tête, pied de page). Exemple : `DashboardLayout.tsx`.

## 2.3. Gestion de l'État (State Management)

Pour ce prototype, la gestion de l'état est intentionnellement maintenue simple et locale, en s'appuyant principalement sur les hooks natifs de React.

-   **État Global** : Le seul état véritablement global est l'état d'authentification (`currentUser`), qui est géré au niveau le plus élevé, dans le composant `App.tsx`. Il est ensuite transmis aux composants enfants via les `props`.
-   **État Local** : Chaque composant de page gère son propre état (listes de données, termes de recherche, filtres, visibilité des modaux) en utilisant les hooks `useState`, `useMemo` et `useCallback`. Cette approche évite la complexité d'une bibliothèque de gestion d'état externe (comme Redux ou Zustand) qui serait superflue pour la portée actuelle du projet.
-   **Hooks Personnalisés** : La logique complexe et réutilisable est extraite dans des hooks personnalisés, comme `useModal.ts`, pour simplifier les composants de page et éviter la duplication de code.

## 2.4. Routage (Client-Side)

Le routage est simulé via un mécanisme simple basé sur l'état, géré dans `DashboardLayout.tsx`.

-   Un état `activePage` (une chaîne de caractères) est maintenu.
-   Le `Sidebar.tsx` contient des liens qui mettent à jour cet état via la fonction `setActivePage`.
-   Le `DashboardLayout.tsx` utilise une instruction `switch` pour rendre le composant de page correspondant à la valeur de `activePage`.

Cette approche simple est suffisante pour le prototype et évite d'introduire une dépendance à une bibliothèque de routage complète comme React Router.

## 2.5. Flux de Données

L'application respecte un **flux de données unidirectionnel** (top-down).

1.  L'état est détenu par un composant parent (par exemple, `DashboardLayout` pour les notifications, ou une page comme `PatientsPage` pour la liste des patients).
2.  Les données (l'état) sont transmises aux composants enfants via les `props`.
3.  Si un composant enfant a besoin de modifier l'état, il le fait en appelant une fonction (callback) qui lui a été passée en `props` par le composant parent.

Ce modèle rend le flux de données prévisible, plus facile à déboguer et à raisonner.

## 2.6. Style et Thème

Le style est géré exclusivement par **Tailwind CSS**.

-   **Approche Utility-First** : Le style est appliqué directement dans le JSX des composants via des classes utilitaires, ce qui accélère le développement et maintient la cohérence.
-   **Configuration Centralisée** : Le thème de l'application (couleurs primaires, polices, etc.) est configuré dans le fichier `index.html` via un objet de configuration `tailwind.config`.
-   **Mode Sombre** : Le support du mode sombre est intégré en utilisant le variant `dark:` de Tailwind, ce qui permet de styler facilement l'application pour les deux thèmes.

## 2.7. Statut de l'Implémentation : Prototype Frontend

Il est important de noter que l'implémentation actuelle est un **prototype frontend de haute fidélité**. L'architecture technique complète, incluant un backend (ex: FastAPI) et une base de données (ex: PostgreSQL), est modélisée dans les documents de conception mais n'est pas construite.

-   **Données** : Toutes les données sont simulées (`mock data`) et stockées en mémoire côté client.
-   **Interactions Serveur** : Les interactions avec un serveur (API REST, WebSockets, Polling) sont **simulées** dans le frontend pour démontrer le comportement attendu de l'application et valider l'expérience utilisateur.

Ce prototype sert de base solide et de "preuve de concept" pour le développement de l'application full-stack complète.