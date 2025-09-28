# 4. Guide de Maintenance Backend (Cible : FastAPI)

## 4.1. Introduction

Ce document décrit l'architecture et les conventions pour le backend de l'application SIS. Bien que le backend ne soit pas implémenté dans ce prototype, ce guide sert de plan directeur pour son développement et sa maintenance.

La stack technologique cible est **Python 3.11+** avec le framework **FastAPI**, choisi pour sa haute performance, sa facilité d'utilisation et sa conformité aux standards modernes (OpenAPI, JSON Schema).

---

## 4.2. Configuration de l'Environnement de Développement

1.  **Créer un Environnement Virtuel** :
    -   Il est crucial d'isoler les dépendances du projet.
    ```bash
    python -m venv venv
    source venv/bin/activate  # Sur macOS/Linux
    venv\Scripts\activate     # Sur Windows
    ```

2.  **Installer les Dépendances** :
    -   Créez un fichier `requirements.txt` qui contiendra les dépendances.
    ```txt
    # requirements.txt
    fastapi
    uvicorn[standard]
    pydantic
    python-jose[cryptography] # Pour les tokens JWT
    passlib[bcrypt]           # Pour le hachage de mots de passe
    sqlalchemy                # ORM pour la base de données
    asyncpg                   # Driver async pour PostgreSQL
    tenacity                  # Pour les stratégies de retry
    ```
    -   Installez-les avec `pip` :
    ```bash
    pip install -r requirements.txt
    ```

3.  **Lancer le Serveur Local** :
    -   Le serveur est lancé avec **Uvicorn**.
    ```bash
    # Supposant que votre instance FastAPI s'appelle "app" dans le fichier "main.py"
    uvicorn main:app --reload
    ```
    -   Le serveur sera accessible sur `http://localhost:8000`.
    -   La documentation interactive (Swagger UI) sera sur `http://localhost:8000/docs`.

---

## 4.3. Structure Suggérée du Projet Backend

Une structure organisée est essentielle pour la maintenabilité.

```plaintext
/
├── venv/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Point d'entrée de l'application FastAPI
│   ├── crud.py                 # Fonctions d'interaction avec la BDD (Create, Read, Update, Delete)
│   ├── database.py             # Configuration de la connexion à la BDD
│   ├── models.py               # Modèles de tables SQLAlchemy
│   ├── schemas.py              # Schémas Pydantic (validation des données d'API)
│   ├── dependencies.py         # Dépendances réutilisables (ex: get_current_user)
│   └── routers/
│       ├── __init__.py
│       ├── auth.py             # Routeur pour l'authentification
│       └── consultations.py    # Routeur pour la ressource "consultations"
└── requirements.txt
```

---

## 4.4. Logique de Cloisonnement (Multi-Tenancy)

C'est la partie la plus critique et complexe du backend. Voici une approche d'implémentation :

1.  **Identifier le Tenant** :
    -   Dans la dépendance `get_current_user`, après avoir validé le token JWT, extrayez l'identifiant de l'établissement (`establishment_id` ou `schema_name`) qui est encodé dans le payload du token.

2.  **Créer une Connexion par Requête** :
    -   Ne créez pas une connexion globale à la base de données. Au lieu de cela, utilisez une dépendance FastAPI pour fournir une session de base de données pour chaque requête.

3.  **Appliquer le Schéma Dynamiquement** :
    -   Dans cette dépendance, avant de retourner la session, exécutez une commande SQL pour définir le `search_path` de la transaction actuelle au schéma du tenant.

**Exemple simplifié (avec SQLAlchemy et `asyncpg`) :**

```python
# dans database.py

async def get_db_session(user: User = Depends(get_current_user)):
    """
    Dépendance FastAPI qui fournit une session de BDD configurée
    pour le schéma de l'utilisateur actuel.
    """
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as connection:
        # Définit le chemin de recherche pour cette transaction uniquement
        await connection.execute(text(f"SET search_path TO {user.schema_name}"))
        
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        
        async with async_session(bind=connection) as session:
            yield session
```

Chaque fonction de route qui a besoin d'accéder à la base de données déclarera alors cette dépendance :

```python
# dans routers/consultations.py

@router.get("/", response_model=list[schemas.Consultation])
async def read_consultations(db: AsyncSession = Depends(get_db_session)):
    # crud.get_consultations utilisera la session `db` qui est déjà
    # configurée pour le bon schéma.
    return await crud.get_consultations(db)
```

Cette approche garantit que toute requête SQL exécutée via cette session sera automatiquement et de manière sécurisée limitée au schéma de données de l'établissement de l'utilisateur, rendant la fuite de données entre tenants très improbable.
