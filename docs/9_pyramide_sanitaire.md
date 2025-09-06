# 9. La Pyramide Sanitaire et les Fonctionnalités

## 9.1. Contexte : Modélisation du Système de Santé Malien

L'application SIS est conçue pour s'adapter à la structure hiérarchique du système de santé au Mali, communément appelée la "pyramide sanitaire". Chaque niveau de cette pyramide a des responsabilités et des besoins spécifiques, qui sont reflétés dans les fonctionnalités et les permissions accordées aux différents rôles d'utilisateurs.

Cette modélisation garantit que l'outil est pertinent et utilisable à tous les échelons, de la saisie de données au niveau communautaire jusqu'à la supervision stratégique au niveau national.

---

## 9.2. Niveaux Opérationnels

### 9.2.1. Premier Échelon : Centre de Santé Communautaire (CSCOM)

-   **Rôle Associé** : `SIS_CSCOM` (Agent du Système d'Information Sanitaire - CSCOM)
-   **Description** : C'est le premier point de contact pour les patients. Les activités se concentrent sur les soins primaires, la prévention et la collecte de données de base.
-   **Fonctionnalités Disponibles** :
    -   **Gestion des Patients** : Création et recherche de dossiers patients.
    -   **Gestion des Consultations** : Enregistrement des consultations de routine (paludisme simple, IRA, etc.).
    -   **Hospitalisations de courte durée** : Gestion des mises en observation simples.
    -   **Surveillance Épidémiologique** : Déclaration des maladies à déclaration obligatoire (MADO) observées.
    -   **Tableau de Bord** : Vue d'ensemble des activités limitées au CSCOM.

### 9.2.2. Deuxième Échelon : Centre de Santé de Référence (CSRéf)

-   **Rôle Associé** : `SIS_CSREF` (Agent du Système d'Information Sanitaire - CSRéf)
-   **Description** : Le CSRéf sert de premier niveau de recours pour les cas référés par les CSCOMs. Il dispose de plus de ressources et d'un plateau technique plus élaboré.
-   **Fonctionnalités Disponibles** :
    -   Toutes les fonctionnalités du niveau CSCOM.
    -   **Gestion des Référencements** (Module) : Gestion des patients référés depuis ou vers d'autres structures.
    -   **Hospitalisations plus complexes** : Gestion de cas nécessitant un suivi plus long.

### 9.2.3. Troisième Échelon : Hôpital

-   **Rôle Associé** : `SIH` (Agent du Système d'Information Hospitalier)
-   **Description** : L'hôpital (régional ou de district) est le sommet de la pyramide opérationnelle locale, offrant des soins spécialisés.
-   **Fonctionnalités Disponibles** :
    -   Toutes les fonctionnalités du niveau CSRéf.
    -   **Gestion des Ressources** : Suivi en temps réel de la disponibilité des lits et de l'état des équipements médicaux.
    -   **Génération de Rapports** : Création de rapports d'activité détaillés pour l'établissement.
    -   **Gestion plus fine des services et spécialités** lors de l'enregistrement des données.

### 9.2.4. Secteur Privé : Cabinets Médicaux

-   **Rôle Associé** : `SIS_CABINET`
-   **Description** : Les structures privées fonctionnent en parallèle du système public.
-   **Fonctionnalités Disponibles** :
    -   Fonctionnalités similaires à celles d'un CSCOM ou CSRéf, adaptées à un contexte privé.
    -   **Facturation** (Module) : Gestion des aspects financiers des consultations et des actes médicaux.

---

## 9.3. Niveaux de Gestion et de Supervision

### 9.3.1. Administration Locale

-   **Rôle Associé** : `ADMIN_LOCAL`
-   **Description** : Responsable de la gestion et de la configuration du système pour un établissement spécifique (Hôpital, CSRéf).
-   **Fonctionnalités Disponibles** :
    -   **Gestion des Utilisateurs** : Création et gestion des comptes utilisateurs pour son établissement.
    -   **Gestion des Services et Spécialités** : Configuration des services médicaux et des spécialités offertes.
    -   **Partage de Données** : Configuration des permissions de partage de données avec d'autres établissements.
    -   **Vue de supervision** des données de son établissement (consultations, hospitalisations, etc.) sans droits de modification directs.

### 9.3.2. Supervision Nationale

-   **Rôles Associés** : `SUPER_ADMIN`, `MINISTERE_SIS`
-   **Description** : Ces rôles ont une vue d'ensemble sur l'ensemble du système, à des fins de supervision, de planification stratégique et de maintenance technique.
-   **Fonctionnalités Disponibles** :
    -   **Tableau de Bord National** : Agrégation des données de tous les établissements.
    -   **Supervision des Données** : Accès en lecture seule à toutes les données (consultations, hospitalisations, cas épidémiologiques) avec des filtres puissants par établissement, région, etc. (`MINISTERE_SIS`).
    -   **Administration Complète de la Plateforme** (`SUPER_ADMIN`) :
        -   Gestion de tous les établissements.
        -   Gestion de tous les utilisateurs, y compris les administrateurs locaux.
        -   Gestion des modules (activation/désactivation de fonctionnalités pour chaque établissement).