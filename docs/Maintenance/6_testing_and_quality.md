# 6. Tests et Qualité du Code

## 6.1. Introduction

Une base de code saine et fiable repose sur deux piliers : une **qualité de code constante** et une **stratégie de test robuste**. Ce guide décrit les outils et les processus mis en place pour assurer ces deux aspects dans le projet SIS.

---

## 6.2. Qualité et Style du Code

Pour éviter les débats sur le style et garantir que le code est lisible et cohérent, le projet utilise une combinaison d'outils d'analyse statique et de formatage automatique.

### 6.2.1. ESLint

-   **Rôle** : Analyse le code TypeScript/React pour détecter les erreurs de programmation, les bugs potentiels, les violations de style et les "code smells".
-   **Configuration** : Les règles sont définies dans le fichier `.eslintrc.cjs`. Elles incluent les recommandations de React, TypeScript et des plugins d'accessibilité.
-   **Utilisation** :
    -   **En temps réel** : L'extension VS Code **ESLint** surligne les problèmes directement dans l'éditeur.
    -   **Manuellement** : Exécutez la commande suivante pour analyser tout le projet.
        ```bash
        npm run lint
        ```
    -   **En CI/CD** : Cette commande doit être intégrée dans le pipeline d'intégration continue (ex: GitHub Actions) pour bloquer les "pull requests" qui introduisent des erreurs.

### 6.2.2. Prettier

-   **Rôle** : Formate automatiquement le code pour qu'il respecte un style prédéfini et cohérent. Il s'occupe des indentations, des points-virgules, de la longueur des lignes, etc.
-   **Configuration** : Les règles sont dans `.prettierrc`.
-   **Utilisation** :
    -   **Automatique (recommandé)** : L'extension VS Code **Prettier - Code formatter** peut être configurée pour formater les fichiers à chaque sauvegarde (`"editor.formatOnSave": true`).
    -   **Manuellement** : Pour formater l'ensemble du projet :
        ```bash
        npm run format
        ```

---

## 6.3. Stratégie de Test (Frontend)

Une pyramide de tests équilibrée est essentielle. L'effort doit être concentré sur les tests unitaires et d'intégration, complétés par quelques tests de bout en bout.

### 6.3.1. Outils

-   **Framework de test** : **Vitest** (ou Jest)
-   **Bibliothèque de test React** : **React Testing Library**
-   **Tests End-to-End (E2E)** : **Cypress** ou **Playwright**

### 6.3.2. Tests Unitaires

-   **Objectif** : Tester un seul composant ou une seule fonction (hook) de manière isolée.
-   **Exemple : Tester un composant `Badge`** (`src/components/ui/Badge.test.tsx`)
    ```tsx
    import { render, screen } from '@testing-library/react';
    import Badge from './Badge';
    import { describe, it, expect } from 'vitest';

    describe('Badge component', () => {
      it('should render the text correctly', () => {
        render(<Badge text="Actif" color="green" />);
        // screen.getByText recherche un élément contenant le texte
        expect(screen.getByText('Actif')).toBeInTheDocument();
      });

      it('should have the correct color class', () => {
        const { container } = render(<Badge text="Actif" color="green" />);
        // On vérifie que la classe CSS attendue est bien présente
        expect(container.firstChild).toHaveClass('bg-green-100');
      });
    });
    ```
-   **Lancement des tests** :
    ```bash
    npm test
    ```

### 6.3.3. Tests d'Intégration

-   **Objectif** : Tester l'interaction entre plusieurs composants. Simuler des actions utilisateur et vérifier que l'UI réagit comme prévu.
-   **Exemple : Tester l'ajout d'un patient dans `PatientsPage`** (`src/components/pages/PatientsPage.test.tsx`)
    ```tsx
    import { render, screen, fireEvent } from '@testing-library/react';
    import userEvent from '@testing-library/user-event';
    import PatientsPage from './PatientsPage';

    describe('PatientsPage', () => {
      it('should add a new patient to the table after form submission', async () => {
        render(<PatientsPage />);
        
        // 1. Simuler l'ouverture du modal
        await userEvent.click(screen.getByRole('button', { name: /Ajouter un patient/i }));
        
        // 2. Vérifier que le modal est bien ouvert
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        
        // 3. Remplir le formulaire
        await userEvent.type(screen.getByLabelText(/Nom complet/i), 'Nouveau Patient');
        // ... remplir les autres champs
        
        // 4. Soumettre le formulaire
        await userEvent.click(screen.getByRole('button', { name: /Enregistrer/i }));
        
        // 5. Vérifier que le nouveau patient apparaît dans le tableau
        expect(screen.getByText('Nouveau Patient')).toBeInTheDocument();
      });
    });
    ```

---

## 6.4. Stratégie de Test (Backend - Cible FastAPI)

-   **Outils** : **Pytest** et le `TestClient` de FastAPI.
-   **Base de Données de Test** : Les tests doivent s'exécuter sur une base de données séparée (ou un schéma de test) qui est créée et détruite pour chaque session de test.
-   **Approche** :
    -   **Tests Unitaires** : Tester la logique métier dans les services/fonctions `crud` de manière isolée, en "mockant" la base de données si nécessaire.
    -   **Tests d'Intégration** : Utiliser le `TestClient` pour envoyer des requêtes HTTP aux endpoints de l'API et vérifier que la réponse (code de statut, corps JSON) est correcte et que l'état de la base de données a été modifié comme attendu.
