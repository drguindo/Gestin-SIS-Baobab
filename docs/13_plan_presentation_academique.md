# Plan de Présentation Académique du Module SIS

**Titre de la Présentation :** Conception et Implémentation d'un Modèle d'Architecture pour un Système d'Information Sanitaire (SIS) Modulaire et Adaptatif : Application au Contexte de la Pyramide Sanitaire Malienne.

---

## 1. Présentation Générale du Projet

### Introduction et Contexte
-   **Contexte Global :** La transformation numérique du secteur de la santé dans les pays à ressources limitées.
-   **Contexte Spécifique :** Le système de santé malien, sa structure pyramidale (CSCOM, CSRéf, Hôpital) et les défis inhérents à la circulation de l'information.
-   **Positionnement :** Ce travail s'inscrit dans le cadre d'une recherche doctorale en informatique médicale, visant à proposer un artefact technologique comme solution à une problématique de terrain.

### 1.1 Problématique Identifiée
-   **Fragmentation des Données :** Saisie sur papier, utilisation de multiples systèmes non-interopérables.
-   **Manque de Données en Temps Réel :** Retards dans la surveillance épidémiologique et la prise de décision.
-   **Rupture dans la Continuité des Soins :** Inefficacité du processus de référencement et de contre-référencement entre les niveaux de la pyramide.
-   **Faiblesse de la Surveillance Spécifique :** Difficultés à collecter et analyser les données critiques comme la Résistance aux Antimicrobiens (RAM).
-   **Hétérogénéité des Besoins :** Un CSCOM n'a pas les mêmes besoins fonctionnels qu'un hôpital régional ou un cabinet privé.

### 1.2 Solution Proposée
-   **Le Module SIS :** Une Single Page Application (SPA) moderne, sécurisée et modulaire.
-   **Principes Fondateurs :**
    -   **Centralisation de la Logique, Décentralisation de la Gestion :** Une plateforme unique avec un cloisonnement strict des données par établissement.
    -   **Adaptabilité par la Modularité :** Une architecture permettant d'activer des fonctionnalités "à la carte" pour chaque établissement.
    -   **Adéquation avec la Pyramide Sanitaire :** Un système de rôles (RBAC) qui modélise fidèlement la hiérarchie et les flux de travail du système de santé.

### 1.3 Objectifs Scientifiques

#### Objectif Principal
Concevoir, implémenter et évaluer un modèle d'architecture logicielle pour un Système d'Information Sanitaire (SIS) modulaire et contextuellement adapté, capable d'améliorer la coordination des soins et la surveillance épidémiologique au sein de la pyramide sanitaire malienne.

#### Objectifs Spécifiques
1.  **Modéliser** formellement la pyramide sanitaire via un système de gestion d'accès basé sur les rôles (RBAC) granulaire.
2.  **Développer** une architecture "composable" où les fonctionnalités peuvent être activées dynamiquement par établissement.
3.  **Implémenter** un modèle de cloisonnement de données sécurisé garantissant la confidentialité tout en permettant une agrégation supervisée pour la santé publique.
4.  **Valider** la pertinence des flux de travail digitalisés (ex: référencement, surveillance RAM) à travers des cas d'usage simulés sur les établissements pilotes.
5.  **Démontrer** la capacité du système à intégrer des modules de santé publique critiques (Épidémiologie, RAM, Campagnes).

### 1.4 Périmètre Fonctionnel

#### 1.4.1 Gestion des Utilisateurs
-   **RBAC :** Super Admin, Admin Local, SIH, SIS_CSREF, SIS_CSCOM, SIS_CABINET, MINISTERE_SIS, et le rôle de centralisation **SIS_INRSP**.
-   **Administration :** Interfaces dédiées pour la gestion des utilisateurs, services et spécialités par établissement.

#### 1.4.2 Gestion des Patients
-   Enregistrement et recherche de patients, formant la base du dossier médical.

#### 1.4.3 Gestion des SIS
-   **Modules Cliniques :** Consultations, Hospitalisations.
-   **Module de Coordination :** Gestion digitalisée du flux de **Référencement et Contre-référencement**.
-   **Modules de Santé Publique :**
    -   **Surveillance Épidémiologique** (MADO).
    -   **Surveillance RAM** (flux de données du terrain vers l'INRSP).
    -   **Gestion des Campagnes** (planification, exécution, suivi).
-   **Module Administratif :** Facturation (spécifique aux structures privées).

#### 1.4.4 Analytics et Reporting
-   **Tableaux de bord dynamiques** avec indicateurs clés (KPIs) et graphiques.
-   **Vues de supervision** avec filtres avancés pour l'analyse multicritères.
-   Module de **génération de rapports** (export de données).

#### 1.4.5 Système de Notifications
-   Simulation de notifications en temps réel pour les événements critiques (admissions, stocks).

### 1.5 Innovation et Contribution

#### 1.5.1 Innovations Techniques
1.  **Architecture "Composable" :** La `Gestion des Modules` permet une activation/désactivation des fonctionnalités par établissement. C'est une approche novatrice pour le déploiement progressif et adapté des SIS.
2.  **Cloisonnement de Données Dynamique :** Le modèle architectural (simulé via le frontend, mais conçu pour PostgreSQL Schemas + FastAPI) qui garantit une isolation stricte des données tout en permettant des vues agrégées sécurisées.
3.  **Modélisation fine des flux de travail :** L'implémentation d'un cycle de vie complet pour le référencement, incluant l'historique et la contre-référence, directement dans l'interface.

#### 1.5.2 Innovations Métier
1.  **Digitalisation du Processus de Référencement :** Transformation d'un processus papier lent et incertain en un flux de travail transparent et traçable.
2.  **Intégration Verticale de la Surveillance RAM :** Création d'un pipeline de données intégré, du point de collecte (CSCOM) à l'analyse nationale (INRSP), une première dans ce contexte.
3.  **Outil de Coordination des Campagnes :** La plateforme devient un outil actif de gestion de la santé publique, pas seulement un entrepôt de données passif.

### 1.6 Méthodologie de Recherche

#### 1.6.1 Approche de Développement
-   **Design Science Research (DSR) :** L'artefact (le module SIS) est construit pour résoudre un problème du monde réel. Le processus est itératif : identification du problème, conception, développement, démonstration et évaluation.
-   **Développement Agile et Centré sur l'Utilisateur :** Le prototypage rapide et la simulation des interactions permettent de valider les concepts avant l'implémentation complète.

#### 1.6.2 Validation Scientifique
-   **Validation par Scénarios d'Usage :** Simulation de cas d'utilisation complexes (ex: un patient référé du CSCOM à l'Hôpital pour un cas de RAM suspecté) pour vérifier la robustesse des flux de travail.
-   **Évaluation de l'Usabilité (prévue) :** Utilisation de méthodes comme le "Heuristic Evaluation" ou des tests utilisateurs avec les profils cibles pour mesurer l'intuitivité de l'interface.
-   **Analyse Comparative :** Comparaison théorique de l'efficacité des processus digitalisés (ex: temps de référencement) par rapport aux processus manuels actuels.

### 1.7 Résultats Attendus

#### 1.7.1 Impacts Immédiats
-   Amélioration de la **qualité et de la disponibilité** des données au niveau opérationnel.
-   Réduction significative du **temps et de l'incertitude** dans la coordination des soins (référencements).
-   Capacité de **détection et de réponse rapide** aux alertes épidémiologiques et de RAM.

#### 1.7.2 Impacts à Long Terme
-   Renforcement du Système National d'Information Sanitaire (SNIS).
-   Prise de décision **basée sur des données probantes** (evidence-based) pour le Ministère de la Santé.
-   **Contribution à la lutte mondiale contre la RAM** grâce à des données structurées et fiables.
-   Proposition d'un **modèle open-source scalable et reproductible** pour d'autres contextes similaires.

### 1.8 Public Cible

#### 1.8.1 Utilisateurs Finaux
-   Personnel soignant (Médecins, Infirmiers).
-   Agents SIS des différents niveaux.
-   Administrateurs locaux d'établissements.
-   Superviseurs et décideurs du Ministère de la Santé.
-   Chercheurs et analystes de l'INRSP.

#### 1.8.2 Établissements Cibles
-   Le prototype est pré-configuré pour la pyramide sanitaire pilote de la région de Mopti :
    -   **CSCOM de Sangha** (1er échelon)
    -   **CSRéf de Djenné** (2ème échelon)
    -   **Hôpital Sominé Dolo** (3ème échelon)
    -   **Cabinets Médicaux Nando & Étoile** (Secteur privé)
    -   **INRSP Bamako** (Centralisation)
    -   **Ministère de la Santé** (Supervision)

## 2. Indicateurs de Succès

-   **Qualitatifs :**
    -   Validation du modèle conceptuel par des experts du domaine.
    -   Score de satisfaction utilisateur élevé lors des tests d'usabilité simulés.
-   **Quantitatifs :**
    -   Démonstration d'une réduction simulée du temps de traitement d'un référencement de > 50%.
    -   Taux de complétude des formulaires de déclaration (RAM, Épidémio) atteignant > 95% dans les simulations.
    -   Publication des résultats de la recherche dans une revue scientifique à comité de lecture.
