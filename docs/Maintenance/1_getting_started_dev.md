# 1. Guide de Démarrage pour Développeurs

## 1.1. Introduction

Ce guide est destiné à l'équipe de développement ou à un agent IA chargé de la maintenance et de l'évolution de l'application SIS. Il fournit des instructions détaillées et multi-plateformes pour configurer un environnement de développement local identique à celui utilisé pour la création du projet.

Suivre ces étapes garantira que tous les outils sont correctement installés et configurés, permettant de lancer, tester, déboguer et construire l'application de manière fiable.

---

## 1.2. Prérequis Logiciels

Avant de commencer, assurez-vous que les logiciels suivants sont installés sur votre machine :

| Logiciel | Version | Description |
| :--- | :--- | :--- |
| **Git** | 2.x ou + | Système de contrôle de version pour cloner et gérer le code source. |
| **Node.js** | 18.x ou + | Environnement d'exécution JavaScript. Inclut npm pour la gestion des dépendances. |
| **IDE** | Recommandé | Un éditeur de code. **Visual Studio Code** est fortement recommandé. |

---

## 1.3. Installation et Configuration

Cette section détaille l'installation des prérequis et le lancement du projet sur Windows, macOS, et Ubuntu/Linux.

### 1.3.1. Commandes Communes

Une fois les prérequis installés, les commandes suivantes sont universelles :

1.  **Cloner le dépôt Git :**
    ```bash
    git clone [URL_DU_DEPOT_GIT]
    cd [NOM_DU_DOSSIER_PROJET]
    ```

2.  **Installer les dépendances du projet :**
    ```bash
    npm install
    ```
    *Cette commande lit le fichier `package.json` et télécharge toutes les bibliothèques nécessaires dans un dossier `node_modules/`.*

3.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    *L'application sera alors accessible à l'adresse `http://localhost:5173` (ou un port similaire si celui-ci est occupé). Le serveur se rechargera automatiquement à chaque modification du code source.*

### 1.3.2. Instructions par Système d'Exploitation

#### ► Pour Windows

1.  **Installer Git :**
    -   Téléchargez et installez **Git for Windows** depuis le [site officiel](https://git-scm.com/download/win).
    -   Pendant l'installation, conservez les options par défaut. L'installateur ajoutera `git` à votre PATH, le rendant accessible depuis n'importe quel terminal.

2.  **Installer Node.js :**
    -   Téléchargez l'installeur de la version **LTS** (Long Term Support) depuis le [site officiel de Node.js](https://nodejs.org/en).
    -   Exécutez l'installeur et suivez les instructions. npm sera installé automatiquement.

3.  **Utiliser le Terminal :**
    -   Ouvrez **PowerShell** ou le **Terminal Windows** et exécutez les [commandes communes](#131-commandes-communes).

#### ► Pour macOS

1.  **Installer Homebrew :**
    -   Si vous ne l'avez pas, ouvrez le Terminal (`Applications > Utilitaires > Terminal`) et installez le gestionnaire de paquets Homebrew en suivant les instructions sur [brew.sh](https://brew.sh/).

2.  **Installer Git et nvm via Homebrew :**
    -   `nvm` (Node Version Manager) est l'outil recommandé pour gérer les versions de Node.js et éviter les problèmes de permissions.
    ```bash
    brew install git
    brew install nvm
    ```
    -   Suivez les instructions post-installation de `nvm` pour l'ajouter à votre profil shell (`~/.zshrc` ou `~/.bash_profile`).

3.  **Installer Node.js via nvm :**
    ```bash
    nvm install --lts  # Installe la dernière version LTS
    nvm use --lts      # Utilise cette version pour la session actuelle
    nvm alias default lts # Définit la version LTS comme version par défaut
    ```

4.  **Exécuter le Projet :**
    -   Dans le Terminal, exécutez les [commandes communes](#131-commandes-communes).

#### ► Pour Ubuntu / Linux (Debian-based)

1.  **Installer Git :**
    ```bash
    sudo apt update
    sudo apt install git
    ```

2.  **Installer nvm (Node Version Manager) :**
    -   Utilisez le script d'installation officiel depuis le [dépôt nvm](https://github.com/nvm-sh/nvm).
    ```bash
    # Vérifiez la version la plus récente sur le dépôt GitHub de nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    -   Fermez et rouvrez votre terminal, ou exécutez `source ~/.bashrc` pour charger `nvm`.

3.  **Installer Node.js via nvm :**
    ```bash
    nvm install --lts
    nvm use --lts
    nvm alias default lts
    ```

4.  **Exécuter le Projet :**
    -   Dans votre terminal, exécutez les [commandes communes](#131-commandes-communes).

---

## 1.4. Configuration de l'Environnement de Développement (IDE)

### 1.4.1. Visual Studio Code

VS Code est l'éditeur recommandé. Pour une productivité maximale, installez les extensions suivantes :

| Extension | ID | Description |
| :--- | :--- | :--- |
| **ESLint** | `dbaeumer.vscode-eslint` | Intègre les règles de linting pour identifier les erreurs en temps réel. |
| **Prettier** | `esbenp.prettier-vscode` | Formate automatiquement le code à la sauvegarde pour un style uniforme. |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Autocomplétion, coloration et documentation pour les classes Tailwind. |
| **GitLens** | `eamodio.gitlens` | Améliore l'intégration de Git avec des informations contextuelles. |

### 1.4.2. Débogage dans VS Code

Pour déboguer le code React directement depuis VS Code :
1.  Ouvrez l'onglet "Exécuter et déboguer" (`Ctrl+Shift+D`).
2.  Cliquez sur "créer un fichier launch.json" et choisissez "Web App (Chrome)" ou "Web App (Edge)".
3.  Le fichier `.vscode/launch.json` sera créé. Assurez-vous que l'URL correspond à celle de votre serveur de développement.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Lancer Chrome sur localhost",
            "url": "http://localhost:5173",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

Vous pouvez maintenant placer des points d'arrêt directement dans votre code `.tsx` et lancer le débogueur (`F5`).

---

## 1.5. Scripts NPM Utiles

Les scripts suivants sont définis dans `package.json` :

-   `npm run dev`: Lance le serveur de développement avec rechargement à chaud.
-   `npm run build`: Construit l'application pour la production dans le dossier `dist/`.
-   `npm run lint`: Exécute ESLint pour analyser le code et trouver des problèmes.
-   `npm run format`: Exécute Prettier pour formater tous les fichiers du projet.
