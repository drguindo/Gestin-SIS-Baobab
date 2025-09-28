# 5. Guide de Maintenance Base de Données (Cible : PostgreSQL/Supabase)

## 5.1. Introduction

Ce guide s'adresse aux administrateurs de bases de données et aux développeurs backend. Il détaille le modèle de données, la stratégie de multi-tenancy, et les procédures de maintenance pour la base de données PostgreSQL qui sous-tend l'application SIS. L'utilisation de **Supabase** est recommandée car elle simplifie la gestion, la sécurité et l'évolutivité.

---

## 5.2. Modèle de Données

-   **Source de Vérité** : Le fichier `src/types.ts` du projet frontend sert de source de vérité conceptuelle pour le modèle de données. Chaque interface (ex: `Consultation`, `RAMCase`) doit correspondre à une table dans la base de données.
-   **Conventions de Nommage** :
    -   Tables : Noms au pluriel, en `snake_case` (ex: `patients`, `consultation_records`).
    -   Colonnes : Noms en `snake_case` (ex: `patient_name`, `admission_date`).
    -   Clés étrangères : `[table_liee_singular]_id` (ex: `patient_id`).

---

## 5.3. Stratégie de Multi-Tenancy : Schéma par Tenant

L'application utilise une approche **Schema-per-Tenant** pour isoler les données de chaque établissement de santé.

-   **Concept** : Chaque "tenant" (établissement) possède son propre **schéma PostgreSQL**. Un schéma est un espace de noms qui contient un ensemble de tables, de vues, etc.
    -   Exemple : `sih_mopti`, `csref_djenne`, `cscom_sangha`.
-   **Structure** :
    -   Le schéma `public` est réservé aux tables partagées (ex: une table `establishments` qui liste tous les tenants).
    -   Chaque schéma de tenant (`sih_mopti`, etc.) contient l'ensemble complet des tables de l'application (`patients`, `consultations`, `ram_cases`, etc.).

**Avantages :**
-   **Isolation des Données Forte** : Il est impossible pour une requête dans un schéma d'accéder aux données d'un autre par accident. C'est une mesure de sécurité et de confidentialité très robuste.
-   **Simplicité des Requêtes Applicatives** : Le code applicatif n'a pas besoin d'ajouter une clause `WHERE establishment_id = ...` à chaque requête.
-   **Sauvegardes par Tenant** : Il est facile de sauvegarder ou de restaurer les données d'un seul établissement en utilisant `pg_dump --schema=...`.

**Inconvénients :**
-   **Complexité des Migrations** : Appliquer un changement de structure (ex: ajouter une colonne) requiert l'exécution de la migration sur **chaque schéma de tenant**.

---

## 5.4. Gestion des Migrations

La gestion des changements de schéma de manière contrôlée et versionnée est cruciale.

### 5.4.1. Utilisation de la CLI Supabase

Supabase fournit une CLI qui s'intègre à Git pour gérer les migrations.

1.  **Lier le projet** :
    ```bash
    supabase login
    supabase link --project-ref <your-project-id>
    ```
2.  **Créer une nouvelle migration** :
    ```bash
    # Crée un nouveau fichier de migration SQL vide
    supabase migration new add_comment_to_consultations
    ```
3.  **Éditer le fichier de migration** :
    -   Ouvrez le fichier SQL généré et ajoutez vos commandes DDL.
    ```sql
    -- migrations/<timestamp>_add_comment_to_consultations.sql
    ALTER TABLE consultation_records ADD COLUMN comment TEXT;
    ```
4.  **Appliquer les migrations localement (si vous utilisez un Docker Supabase local)** :
    ```bash
    supabase db reset # Applique toutes les migrations au conteneur local
    ```
5.  **Déployer les migrations en production** :
    ```bash
    supabase db push
    ```

### 5.4.2. Script pour Migrations Multi-Tenant

La CLI Supabase standard n'applique pas les migrations à plusieurs schémas. Il faut donc un script personnalisé pour cela.

**Exemple de script shell :**
```bash
#!/bin/bash
set -e

# Récupère la liste de tous les schémas de tenants (sauf public, etc.)
SCHEMAS=$(psql $DATABASE_URL -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('public', 'information_schema', ...);" -t)

# Le contenu de votre migration SQL
MIGRATION_SQL="ALTER TABLE consultation_records ADD COLUMN comment TEXT;"

for SCHEMA in $SCHEMAS; do
  echo "Applying migration to schema: $SCHEMA"
  # Applique la migration en définissant le search_path
  psql $DATABASE_URL -c "SET search_path TO $SCHEMA; $MIGRATION_SQL"
done

echo "Migrations applied to all tenants."
```
*Ce script doit être intégré dans un processus de CI/CD pour être exécuté de manière sécurisée.*

---

## 5.5. Sécurité : Row-Level Security (RLS)

RLS est une couche de sécurité supplémentaire. Même si le backend est compromis, RLS peut empêcher l'accès non autorisé aux données.

**Exemple de politique RLS sur la table `consultations` :**

```sql
-- Active RLS pour la table
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Crée une politique qui autorise un médecin à ne voir que ses propres consultations
CREATE POLICY "medecin_peut_voir_ses_consultations"
ON consultations FOR SELECT
USING (
  -- La fonction auth.uid() de Supabase récupère l'ID de l'utilisateur authentifié
  -- On suppose qu'on a une table "users" qui lie l'ID d'auth à un ID interne
  doctor_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);
```
Cette politique garantit que même si une requête `SELECT * FROM consultations` est exécutée, elle ne retournera que les lignes où `doctor_id` correspond à l'utilisateur actuellement connecté.
