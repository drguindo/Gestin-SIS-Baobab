# 7. Guide de Déploiement

## 7.1. Introduction

Ce document fournit les instructions et les meilleures pratiques pour construire, déployer et héberger les différentes couches de l'application SIS (frontend, backend, base de données) dans un environnement de production.

---

## 7.2. Déploiement du Frontend (React)

Le frontend est une application statique. Le processus de déploiement consiste à construire les fichiers statiques (HTML, CSS, JS) puis à les héberger sur un service adapté.

### 7.2.1. Étape de Construction (Build)

1.  **Variables d'Environnement** :
    -   Créez un fichier `.env.production` à la racine du projet pour stocker les variables d'environnement de production. La variable la plus importante est l'URL de l'API backend.
    ```
    # .env.production
    VITE_API_BASE_URL=https://api.sis-mali.org
    ```
    -   Dans le code, accédez à cette variable via `import.meta.env.VITE_API_BASE_URL`.

2.  **Lancer la Commande de Build** :
    ```bash
    npm run build
    ```
    -   Cette commande utilise Vite pour compiler, optimiser et minifier tout le code source dans un dossier `dist/`. Ce dossier contient tout ce qui est nécessaire pour faire fonctionner l'application.

### 7.2.2. Options d'Hébergement

| Service | Avantages | Idéal pour |
| :--- | :--- | :--- |
| **Vercel** | Intégration Git parfaite, déploiement instantané, CDN global. **Recommandé.** | Projets React, déploiement rapide et simple. |
| **Netlify** | Similaire à Vercel, très bonne intégration CI/CD. | Projets statiques et Jamstack. |
| **AWS S3 + CloudFront** | Hautement scalable, personnalisable, intégré à l'écosystème AWS. | Projets nécessitant une configuration fine de l'infrastructure. |

**Processus de déploiement avec Vercel (exemple) :**
1.  Poussez votre code sur un dépôt GitHub, GitLab, ou Bitbucket.
2.  Créez un compte sur Vercel et liez-le à votre compte Git.
3.  Importez votre projet depuis le dépôt Git.
4.  Vercel détectera automatiquement que c'est un projet Vite.
5.  Configurez vos variables d'environnement (`VITE_API_BASE_URL`) dans le tableau de bord de Vercel.
6.  Cliquez sur "Deploy".
Vercel construira et déploiera automatiquement votre site. Chaque `git push` sur la branche principale déclenchera un nouveau déploiement.

---

## 7.3. Déploiement du Backend (FastAPI - Cible)

Le backend est une application dynamique qui nécessite un environnement d'exécution Python.

### 7.3.1. Conteneurisation avec Docker

Il est fortement recommandé de conteneuriser l'application backend avec Docker pour garantir la portabilité et la reproductibilité de l'environnement.

**Exemple de `Dockerfile` :**
```Dockerfile
FROM python:3.11-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

# Commande pour lancer l'application avec un serveur de production comme Gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:80"]
```

### 7.3.2. Options d'Hébergement

| Service | Avantages | Idéal pour |
| :--- | :--- | :--- |
| **Heroku** | Très simple à utiliser, gère l'infrastructure pour vous. | Prototypes et petites applications. |
| **DigitalOcean App Platform** | Similaire à Heroku mais plus flexible et souvent moins cher. | Applications de petite à moyenne taille. |
| **AWS Elastic Container Service (ECS)** | Hautement scalable, puissant, intégré à AWS. Plus complexe. | Applications à grande échelle nécessitant une haute disponibilité. |

---

## 7.4. Déploiement de la Base de Données (PostgreSQL - Cible)

Il est **fortement déconseillé** d'héberger soi-même une base de données en production. Utilisez un service managé.

| Service | Avantages | Idéal pour |
| :--- | :--- | :--- |
| **Supabase** | Offre PostgreSQL + authentification, API, RLS. **Recommandé.** | Projets qui veulent une solution "backend-as-a-service" intégrée. |
| **AWS RDS** | Service PostgreSQL managé, robuste, scalable, fiable. | Projets intégrés à l'écosystème AWS. |
| **DigitalOcean Managed Databases** | Simple à configurer et à utiliser. | Projets hébergés sur DigitalOcean. |

**Points importants :**
-   **Sécurité** : Configurez des mots de passe forts, limitez l'accès à l'IP de votre serveur backend, et activez les sauvegardes automatiques.
-   **Variables d'Environnement** : L'URL de connexion à la base de données doit être stockée de manière sécurisée dans les variables d'environnement de votre backend, jamais dans le code.

---

## 7.5. Intégration et Déploiement Continus (CI/CD)

Automatiser le processus de test et de déploiement est essentiel pour la fiabilité.

**Exemple de workflow avec GitHub Actions :**
-   **Déclencheur** : Un `push` sur la branche `main`.
-   **Jobs** :
    1.  **`lint-and-test`** :
        -   Checkout du code.
        -   Installe Node.js.
        -   Exécute `npm install`.
        -   Exécute `npm run lint`.
        -   Exécute `npm test`.
    2.  **`build-and-deploy`** (dépend de la réussite de `lint-and-test`) :
        -   Checkout du code.
        -   Construit l'application (`npm run build`).
        -   Déploie les fichiers statiques sur Vercel/Netlify ou l'image Docker sur le service d'hébergement.

Ce pipeline garantit que seul du code de qualité et qui passe les tests est déployé en production.
