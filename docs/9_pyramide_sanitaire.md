# 9. La Pyramide Sanitaire et les Fonctionnalités

## 9.1. Contexte : Modélisation du Système de Santé Malien

L'application SIS est conçue pour s'adapter à la structure hiérarchique du système de santé au Mali, communément appelée la "pyramide sanitaire". Chaque niveau de cette pyramide a des responsabilités et des besoins spécifiques, qui sont reflétés dans les fonctionnalités et les permissions accordées aux différents rôles d'utilisateurs.

Cette modélisation a été enrichie pour inclure des modules critiques de santé publique comme la **Surveillance de la Résistance aux Antimicrobiens (RAM)** et pour intégrer des acteurs nationaux clés comme l'**Institut National de Recherche en Santé Publique (INRSP)**, garantissant que l'outil est pertinent et utilisable à tous les échelons, de la saisie de données au niveau communautaire jusqu'à la supervision stratégique au niveau national.

---

## 9.2. Niveaux Opérationnels

### 9.2.1. Premier Échelon : Centre de Santé Communautaire (CSCOM)

-   **Rôle Associé** : `SIS_CSCOM`
-   **Description** : Le premier point de contact pour les patients. Les activités se concentrent sur les soins primaires, la prévention et la collecte de données de base.
-   **Fonctionnalités Clés** :
    -   **Gestion des Patients & Consultations** : Enregistrement des dossiers et des consultations de routine.
    -   **Hospitalisations de courte durée** : Gestion des mises en observation simples.
    -   **Surveillance Épidémiologique** : Déclaration des maladies à déclaration obligatoire (MADO).
    -   **Surveillance RAM** : Saisie et déclaration des cas de RAM (transmis pour analyse).
    -   **Référencements (Initiateur)** : Peut **initier un référencement** vers un niveau supérieur (CSRéf ou Hôpital) et suivre son statut (contre-référence).
    -   **Campagnes de Santé Publique (Participant)** : Visualise les campagnes auxquelles le CSCOM doit participer et peut **rapporter la progression** (ex: nombre d'enfants vaccinés).

### 9.2.2. Deuxième Échelon : Centre de Santé de Référence (CSRéf)

-   **Rôle Associé** : `SIS_CSREF`
-   **Description** : Le CSRéf sert de premier niveau de recours et de coordination de district.
-   **Fonctionnalités Clés** :
    -   Toutes les fonctionnalités du niveau CSCOM.
    -   **Surveillance RAM** : Saisie et analyse de base des cas de RAM.
    -   **Référencements (Pivot)** : Peut initier des référencements, mais surtout, peut **recevoir et mettre à jour le statut** des référencements provenant des CSCOMs (accepter/refuser), agissant comme un pivot de coordination.
    -   **Campagnes de Santé Publique (Coordinateur/Superviseur)** : Peut **planifier de nouvelles campagnes** pour les établissements de son district, définir les objectifs par participant, et **suivre/évaluer** la progression globale en temps réel.

### 9.2.3. Troisième Échelon : Hôpital

-   **Rôle Associé** : `SIH`
-   **Description** : L'hôpital offre des soins spécialisés et gère des cas complexes.
-   **Fonctionnalités Clés** :
    -   Toutes les fonctionnalités du niveau CSRéf (sauf la planification de campagnes, qui est un rôle de supervision de district).
    -   **Surveillance RAM** : Analyse des cas de RAM complexes, agit comme laboratoire de référence.
    -   **Référencements (Destination)** : Reçoit et met à jour le statut des cas complexes référés par les niveaux inférieurs.
    -   **Gestion des Ressources** : Suivi des lits et équipements.
    -   **Génération de Rapports** : Création de rapports d'activité détaillés.
    -   **Campagnes de Santé Publique (Participant)** : Participe aux campagnes et rapporte sa progression.

### 9.2.4. Secteur Privé : Cabinets Médicaux

-   **Rôle Associé** : `SIS_CABINET`
-   **Description** : Structures privées intégrées dans l'écosystème de santé.
-   **Fonctionnalités Clés** :
    -   **Gestion des Patients & Consultations**.
    -   **Facturation (Module Principal)** : Fonctionnalité clé pour le secteur privé. Permet de **créer des factures détaillées** en recherchant des patients existants, en sélectionnant des actes médicaux prédéfinis avec leurs prix, et en choisissant un mode de paiement.
    -   **Surveillance RAM** : Saisie et déclaration des cas de RAM.
    -   **Référencements (Initiateur)** : Peut initier des référencements vers le secteur public.
    -   **Campagnes de Santé Publique (Participant)** : Peut être inclus dans les campagnes de santé publique et rapporter sa progression.

---

## 9.3. Niveaux de Gestion et de Supervision

### 9.3.1. Administration Locale

-   **Rôle Associé** : `ADMIN_LOCAL`
-   **Description** : Responsable de la configuration du système pour son établissement.
-   **Fonctionnalités Clés** :
    -   **Gestion des Utilisateurs, Services & Spécialités** pour son établissement.
    -   **Partage de Données** : Configuration des permissions de partage.
    -   **Vue de supervision** des données de son établissement.
    -   **Campagnes de Santé Publique (Coordinateur)** : Peut, comme un CSRéf, planifier et superviser des campagnes.

### 9.3.2. Supervision Nationale (Ministère)

-   **Rôles Associés** : `SUPER_ADMIN`, `MINISTERE_SIS`
-   **Description** : Vue d'ensemble sur l'ensemble du système pour la stratégie et la maintenance.
-   **Fonctionnalités Clés** :
    -   **Supervision Globale** : Accès en lecture seule à toutes les données agrégées.
    -   **Analyse de Données** : Utilise des **filtres avancés** sur les pages principales (Consultations, RAM, Campagnes, Référencements) pour analyser les tendances nationales par établissement, service, pathologie, etc.
    -   **Administration Complète de la Plateforme** (`SUPER_ADMIN`) :
        -   Gestion de tous les établissements, utilisateurs, et modules.
        -   Peut superviser toutes les campagnes nationales.

### 9.3.3. Centralisation Nationale (INRSP)
- **Rôle Associé** : `SIS_INRSP`
- **Description** : L'Institut National de Recherche en Santé Publique est l'organe de centralisation, d'analyse et de surveillance pour les données de santé publique critiques, notamment la RAM.
- **Fonctionnalités Clés** :
    - **Vue Consolidée Nationale** : Accès à toutes les données de RAM, épidémiologie, consultations, etc., de tous les établissements du réseau.
    - **Analyse et Filtrage Avancés** : Dispose d'outils puissants pour **filtrer les données nationales** par établissement, microorganisme, niveau de résistance, service et spécialité, permettant une analyse fine et ciblée.
    - **Génération de Rapports** : Capacité à exporter des données brutes et des rapports synthétiques pour l'analyse scientifique et la prise de décision stratégique.
    - **Supervision** : Agit comme un superviseur technique pour garantir la qualité et la complétude des données remontées par les niveaux inférieurs.