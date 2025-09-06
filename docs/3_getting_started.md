# 3. Guide de Démarrage et de Reproduction

Ce guide fournit les instructions nécessaires pour installer, configurer et lancer l'application en local. Suivre ces étapes est essentiel pour la reproduction de l'environnement de développement sur différentes plateformes.

## 3.1. Prérequis

Avant de commencer, assurez-vous que les logiciels suivants sont installés sur votre machine :

-   **Node.js** : Version 18.x ou supérieure. Node.js inclut npm (Node Package Manager).
-   **Git** : Outil de contrôle de version pour cloner le projet.
-   **Un éditeur de code** : Visual Studio Code est fortement recommandé.

---

## 3.2. Installation et Lancement

Les commandes de base pour cloner et lancer le projet sont les mêmes quel que soit le système d'exploitation. La section suivante détaille comment installer les prérequis sur chaque plateforme.

**Commandes principales :**

1.  **Cloner le dépôt :**
    ```bash
    git clone [URL_DU_DEPOT_GIT]
    ```

2.  **Naviguer dans le dossier du projet :**
    ```bash
    cd [NOM_DU_DOSSIER_PROJET]
    ```

3.  **Installer les dépendances :**
    ```bash
    npm install
    ```

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application sera alors accessible à l'adresse `http://localhost:5173` (ou un port similaire).

---

### 3.2.1. Instructions pour Windows

1.  **Installer Git :**
    -   Téléchargez et installez Git for Windows depuis le [site officiel git-scm.com](https://git-scm.com/download/win).
    -   Pendant l'installation, vous pouvez conserver les options par défaut. Assurez-vous que Git est ajouté au PATH de Windows pour pouvoir l'utiliser depuis n'importe quel terminal.

2.  **Installer Node.js :**
    -   Téléchargez l'installeur de la version LTS (Long Term Support) depuis le [site officiel de Node.js](https://nodejs.org/).
    -   Exécutez l'installeur et suivez les instructions. npm sera installé automatiquement avec Node.js.

3.  **Utiliser le Terminal :**
    -   Ouvrez **PowerShell** ou le **Terminal Windows**.
    -   Exécutez les commandes principales listées ci-dessus.

---

### 3.2.2. Instructions pour macOS

1.  **Installer Homebrew (recommandé) :**
    -   Si vous n'avez pas Homebrew, ouvrez le Terminal et exécutez la commande disponible sur [brew.sh](https://brew.sh/).

2.  **Installer Git et Node.js via Homebrew :**
    -   Ouvrez le Terminal et exécutez les commandes suivantes :
    ```bash
    brew install git
    brew install node
    ```

3.  **Exécuter le Projet :**
    -   Dans le Terminal, exécutez les commandes principales listées ci-dessus.

---

### 3.2.3. Instructions pour Ubuntu / Linux

1.  **Installer Git :**
    -   Ouvrez un terminal et mettez à jour votre gestionnaire de paquets, puis installez Git :
    ```bash
    sudo apt update
    sudo apt install git
    ```

2.  **Installer Node.js via nvm (Node Version Manager) :**
    -   `nvm` est la méthode recommandée pour éviter les problèmes de permissions et gérer facilement plusieurs versions de Node.js.
    -   Installez `nvm` en utilisant le script d'installation `curl` ou `wget` disponible dans le [dépôt officiel de nvm](https://github.com/nvm-sh/nvm) :
    ```bash
    # Exemple avec curl, vérifiez le README de nvm pour la version la plus récente
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    -   Fermez et rouvrez votre terminal, puis installez la version LTS de Node.js :
    ```bash
    nvm install --lts
    nvm use --lts
    ```

3.  **Exécuter le Projet :**
    -   Dans votre terminal, exécutez les commandes principales listées ci-dessus.
