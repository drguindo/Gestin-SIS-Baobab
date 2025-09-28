# 2. Architecture Technique pour la Maintenance

## 2.1. Introduction

Ce document détaille l'architecture technique cible de l'application SIS. Il est destiné aux développeurs et aux agents IA pour leur permettre de comprendre les choix de conception, les flux de données et la séparation des responsabilités entre le frontend, le backend et la base de données.

L'architecture est conçue autour de trois piliers :
1.  **Séparation Claire des Couches** : Un frontend React découplé, une API backend FastAPI, et une base de données PostgreSQL.
2.  **Sécurité par Conception** : Un modèle de cloisonnement des données (multi-tenant) pour garantir une isolation stricte entre les établissements.
3.  **Évolutivité** : Une structure modulaire qui facilite l'ajout de nouvelles fonctionnalités.

---

## 2.2. Couche Frontend (React SPA)

Le frontend est le point d'entrée de l'utilisateur. Il est responsable de l'affichage de l'interface et de la gestion de l'état de la session.

-   **Structure des Composants** :
    -   `src/components/pages/` : Contient les composants "intelligents" qui représentent une page. C'est ici que réside la logique métier de la page (gestion de l'état, appels API, logique RBAC).
    -   `src/components/ui/` : Contient les composants de présentation "bêtes" et réutilisables (`Card`, `Table`, `Modal`). Ils ne font que recevoir des props et afficher de l'UI.
    -   `src/components/layout/` : Définit la structure principale de l'application (`Sidebar`, `Header`).
-   **Gestion de l'État** :
    -   **État Global** : Limité au strict nécessaire, principalement l'objet `currentUser` géré dans `App.tsx`. Pour une application plus complexe, l'utilisation de **Zustand** serait une prochaine étape logique pour sa simplicité et sa performance.
    -   **État Local** : Chaque page gère son propre état avec les hooks `useState`, `useMemo`, et `useCallback`. C'est la stratégie par défaut.
-   **Flux de Données** :
    -   **Unidirectionnel** : Les données circulent du haut (composants parents) vers le bas (composants enfants) via les `props`.
    -   **Modification de l'État Parent** : Un enfant qui doit modifier l'état d'un parent le fait en appelant une fonction (callback) passée en `props`.
-   **Communication avec le Backend** :
    -   Actuellement simulée, la communication se fera via des appels `fetch` à l'API REST du backend. Il est recommandé de créer une couche de service (ex: `src/services/api.ts`) pour centraliser et gérer ces appels.

---

## 2.3. Couche Backend (Cible : FastAPI)

Le backend est le cerveau de l'application. Il gère la logique métier, la sécurité et la communication avec la base de données. **FastAPI** est choisi pour ses performances, sa syntaxe moderne et sa génération automatique de documentation.

-   **Philosophie API REST** :
    -   Les endpoints suivent les conventions REST (ex: `GET /patients`, `POST /patients`, `GET /patients/{id}`).
    -   **Pydantic** est utilisé pour valider les données d'entrée et de sortie, garantissant la robustesse de l'API.
-   **Authentification et Autorisation** :
    -   **Flux JWT** : L'endpoint `/login` renvoie un JSON Web Token (JWT) après une authentification réussie. Ce token est ensuite inclus dans l'en-tête `Authorization` de toutes les requêtes suivantes.
    -   **Dépendances de Sécurité** : FastAPI utilise un système de dépendances pour protéger les routes. Une dépendance `get_current_user` décode le token JWT, récupère l'utilisateur et ses permissions, et l'injecte dans la requête.
-   **Logique de Cloisonnement (Multi-Tenancy)** :
    -   C'est la fonctionnalité la plus critique du backend. Chaque utilisateur appartient à un "tenant" (un établissement).
    -   Pour chaque requête authentifiée, le backend doit :
        1.  Identifier l'établissement de l'utilisateur à partir de son token JWT.
        2.  **Configurer la connexion à la base de données pour utiliser le schéma PostgreSQL correspondant à cet établissement.** (ex: `SET search_path TO sih_mopti;`).
        3.  Exécuter la requête SQL, qui sera alors automatiquement limitée au schéma de l'établissement.
    -   Cette logique doit être implémentée via un **middleware** ou une dépendance FastAPI pour s'appliquer à toutes les requêtes.

---

## 2.4. Couche de Données (Cible : PostgreSQL sur Supabase)

La base de données stocke toutes les informations de l'application. PostgreSQL est choisi pour sa robustesse et ses fonctionnalités avancées. **Supabase** est une excellente option car il offre une instance PostgreSQL managée avec des outils additionnels (authentification, API auto-générée, Row-Level Security).

-   **Stratégie de Multi-Tenancy : Schéma par Tenant** :
    -   Chaque établissement de santé (`sih_mopti`, `csref_djenne`, etc.) possède son propre **schéma** dans la même base de données.
    -   Toutes les tables (`patients`, `consultations`, etc.) sont répliquées dans chaque schéma.
    -   **Avantages** : Isolation totale des données, simplicité des requêtes (pas de `WHERE establishment_id = ...` partout).
    -   **Inconvénients** : La gestion des migrations de base de données est plus complexe car elles doivent être appliquées à chaque schéma.
-   **Sécurité Renforcée : Row-Level Security (RLS)** :
    -   En plus du cloisonnement par schéma, Supabase facilite l'implémentation de RLS.
    -   Des politiques peuvent être définies pour s'assurer qu'un utilisateur ne peut accéder qu'aux lignes qui lui appartiennent, même au sein du même schéma (ex: un médecin ne voit que ses propres consultations).
-   **Vues Consolidées pour la Supervision** :
    -   Pour les rôles de supervision (`MINISTERE_SIS`), une **vue SQL** (`materialized view` pour la performance) est créée.
    -   Cette vue utilise des `UNION ALL` pour agréger les données de tables spécifiques (ex: `epidemiology_cases`) à travers tous les schémas des établissements.
    -   L'accès à cette vue est strictement limité aux rôles de supervision.

-   **Migrations** :
    -   Utiliser la **CLI de Supabase** ou un outil comme **Alembic** (pour les projets Python/SQLAlchemy) pour gérer les changements de schéma de manière versionnée.
    -   Un script de migration doit être capable d'itérer sur tous les schémas de tenants pour appliquer les changements uniformément.
