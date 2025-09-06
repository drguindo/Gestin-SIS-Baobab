# 1. Introduction

## 1.1. Contexte du Projet

Ce document présente la documentation technique et conceptuelle d'un module prototype de Système d'Information Sanitaire (SIS), spécifiquement conçu pour le contexte de la gestion hospitalière au Mali. Ce travail constitue une contribution scientifique dans le cadre d'une thèse de doctorat en informatique médicale. L'objectif principal est de proposer une architecture logicielle moderne, résiliente et adaptable, pouvant servir de base pour le développement de systèmes de santé robustes dans des environnements à ressources limitées.

L'application est une **Single Page Application (SPA)**, développée avec des technologies modernes et éprouvées pour garantir la performance, la maintenabilité et une excellente expérience utilisateur.

## 1.2. Objectifs Scientifiques et Techniques

Le projet vise à atteindre plusieurs objectifs clés :

1.  **Reproductibilité** : Fournir une base de code et une documentation suffisamment claires et complètes pour permettre à d'autres chercheurs ou développeurs de reproduire l'environnement et de valider les résultats.
2.  **Modularité** : Concevoir une architecture basée sur des composants qui permet d'activer, de désactiver ou d'étendre des fonctionnalités (modules) sans impacter le cœur du système.
3.  **Gestion d'Accès Basée sur les Rôles (RBAC)** : Implémenter un système RBAC flexible et granulaire, essentiel pour la sécurité et la confidentialité des données médicales, en modélisant les hiérarchies complexes des systèmes de santé.
4.  **Performance et Accessibilité** : Assurer une interface utilisateur rapide, réactive et accessible, même sur des connexions réseau de faible qualité, et utilisable par du personnel ayant des niveaux de compétence informatique variés.
5.  **Simulation de Données Réalistes** : Utiliser un ensemble de données simulées mais plausibles pour démontrer les fonctionnalités de manière concrète sans utiliser de données réelles de patients, respectant ainsi l'éthique de la recherche.

## 1.3. Public Cible

Cette documentation s'adresse à plusieurs profils :
-   **Chercheurs en informatique médicale** : Pour comprendre l'architecture et les concepts sous-jacents.
-   **Développeurs de logiciels de santé** : Comme guide pratique pour la mise en œuvre de fonctionnalités similaires.
-   **Étudiants et professionnels de la santé publique** : Pour visualiser comment un SIS moderne peut être structuré.
-   **Évaluateurs de thèse** : Pour fournir une vue d'ensemble complète et transparente du travail technique réalisé.

## 1.4. Pile Technologique

La sélection des technologies a été guidée par des critères de maturité, de performance, et de soutien par la communauté :

-   **Framework Frontend** : **React 19** pour son écosystème robuste et son modèle de programmation déclaratif.
-   **Langage** : **TypeScript** pour la robustesse, la maintenabilité et la documentation du code grâce au typage statique.
-   **Styling** : **Tailwind CSS** pour un développement rapide d'interfaces cohérentes et personnalisables, incluant un support natif pour le mode sombre.
-   **Visualisation de Données** : **Recharts** pour la création de graphiques interactifs et informatifs.
