# 11. Guide de Maintenance et de Développement

Ce document s'adresse aux développeurs chargés de la maintenance, du débogage et de l'évolution de l'application. Il contient des recommandations et des procédures pour assurer la qualité et la cohérence du code sur le long terme.

## 11.1. Environnement de Développement

Un environnement de développement bien configuré est la clé de la productivité et de la qualité du code.

### 11.1.1. Visual Studio Code (Recommandé)

VS Code est l'éditeur de choix pour ce projet en raison de son excellent support pour TypeScript, React et son vaste écosystème d'extensions.

**Extensions Recommandées :**

Pour une expérience de développement optimale, installez les extensions suivantes depuis la marketplace de VS Code :

-   **ESLint** (dbaeumer.vscode-eslint) : Intègre les règles de linting directement dans l'éditeur pour identifier les problèmes de qualité de code en temps réel.
-   **Prettier - Code formatter** (esbenp.prettier-vscode) : Formate automatiquement le code au moment de la sauvegarde pour garantir un style de code uniforme dans tout le projet.
-   **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss) : Fournit l'autocomplétion, la coloration syntaxique et le linting pour les classes utilitaires de Tailwind CSS.
-   **GitLens** (eamodio.gitlens) : Améliore considérablement les fonctionnalités Git intégrées (visualisation des auteurs des lignes, historique, etc.).
-   **Markdown All in One** (yzhang.markdown-all-in-one) : Facilite l'édition de la documentation Markdown avec des raccourcis, des aperçus et des outils de formatage.

### 11.1.2. Cursor (Alternative IA-Native)

Pour les développeurs qui souhaitent tirer parti de l'intelligence artificielle, [Cursor](https://cursor.sh/) est un fork de VS Code qui intègre des fonctionnalités d'IA avancées. Il peut être utilisé pour :
-   **Générer du code** : Créer des composants ou des fonctions à partir de prompts en langage naturel.
-   **Refactoriser** : Améliorer ou modifier du code existant de manière intelligente.
-   **Expliquer du code** : Obtenir des explications sur des portions de code complexes.
-   **Déboguer** : Aider à identifier la cause des erreurs.

---

## 11.2. Débogage de l'Application

### 11.2.1. Outils de Développement du Navigateur

Les outils intégrés aux navigateurs modernes (Chrome, Firefox, Edge) sont la première ligne de défense pour le débogage.

-   **React Developer Tools** : Indispensable. C'est une extension de navigateur qui vous permet d'inspecter la hiérarchie des composants React, de visualiser leurs `props` et leur `state`, et de profiler les performances.
-   **Console** : Utilisez `console.log()` pour inspecter les variables à des points clés de l'exécution.
-   **Debugger** : Placez l'instruction `debugger;` dans votre code pour créer un point d'arrêt. L'exécution du code s'arrêtera à cet endroit, et vous pourrez inspecter la pile d'appels, les variables locales et exécuter le code pas à pas.

### 11.2.2. Débogage dans VS Code

VS Code permet de déboguer le code JavaScript s'exécutant dans le navigateur directement depuis l'éditeur.

1.  Allez dans l'onglet "Run and Debug" (Ctrl+Shift+D).
2.  Cliquez sur "create a launch.json file" et sélectionnez "Web App (Chrome)" ou "Web App (Edge)".
3.  Modifiez le fichier `launch.json` généré pour pointer vers l'URL de votre serveur de développement (par ex., `http://localhost:5173`).

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:5173",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```
Vous pouvez ensuite placer des points d'arrêt directement dans votre code source dans VS Code.

---

## 11.3. Qualité et Style du Code

Pour maintenir une base de code saine, il est essentiel d'utiliser des outils d'analyse statique et de formatage.

-   **ESLint** : Analyse le code pour trouver des problèmes potentiels, des bugs, ou des écarts par rapport aux bonnes pratiques.
-   **Prettier** : Est un formateur de code "opiniâtre" qui reformate automatiquement le code pour qu'il respecte un style cohérent.

Il est recommandé de configurer des scripts `npm` dans `package.json` pour exécuter ces outils :

```json
"scripts": {
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write ."
}
```

---

## 11.4. Gestion des Dépendances

Les dépendances du projet sont gérées par `npm` et définies dans le fichier `package.json`.

-   **Mettre à jour les dépendances** : Pour mettre à jour les paquets vers leurs dernières versions compatibles, utilisez :
    ```bash
    npm update
    ```
-   **Ajouter une nouvelle dépendance** :
    ```bash
    # Pour une dépendance de production
    npm install nom-du-paquet

    # Pour une dépendance de développement (ex: un outil de test)
    npm install nom-du-paquet --save-dev
    ```
-   **Vérifier les vulnérabilités** : Régulièrement, lancez un audit de sécurité sur vos dépendances :
    ```bash
    npm audit
    ```
    Suivez les instructions pour corriger les vulnérabilités trouvées (`npm audit fix`).
