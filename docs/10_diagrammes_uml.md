# 10. Diagrammes de Modélisation (UML)

## 10.1. Introduction

L'Unified Modeling Language (UML) est une norme de modélisation graphique utilisée en génie logiciel pour visualiser, spécifier, construire et documenter les artefacts d'un système. Les diagrammes suivants ont été créés en utilisant la syntaxe **Mermaid**, ce qui permet de les intégrer directement dans cette documentation Markdown. Ils offrent une vue formelle et académique de l'architecture, des fonctionnalités et des interactions au sein de l'application SIS.

---

## 10.2. Diagramme de Cas d'Utilisation

Ce diagramme illustre les interactions entre les acteurs (utilisateurs) et les fonctionnalités majeures du système, en respectant la pyramide sanitaire.

**Acteurs :**
-   **Agent de Santé** : Acteur général représentant le personnel de terrain (rôles `SIH`, `SIS_CSREF`, `SIS_CSCOM`, `SIS_CABINET`).
-   **Admin Local** : Acteur responsable de la configuration de son établissement.
-   **Superviseur National** : Acteur avec une vue globale sur le système (`SUPER_ADMIN`, `MINISTERE_SIS`).

```mermaid
graph TD
    subgraph "Système d'Information Sanitaire (SIS)"
        direction LR
        
        subgraph "Module Clinique"
            UC1[Gérer Dossiers Patients]
            UC2[Gérer Consultations]
            UC3[Gérer Hospitalisations]
            UC4[Gérer Référencements]
        end
        
        subgraph "Module Santé Publique"
            UC5[Déclarer Cas Épidémiologiques]
            UC6[Générer Rapports]
        end
        
        subgraph "Module Support"
            UC7[Gérer Ressources (Lits, Équipements)]
            UC8[Gérer Facturation]
            UC9[Consulter Tableau de Bord]
        end

        subgraph "Module Administration Locale"
            UC10[Gérer Utilisateurs de l'établissement]
            UC11[Configurer Services & Spécialités]
            UC12[Configurer Partage de Données]
        end
        
        subgraph "Module Supervision Nationale"
            UC13[Superviser Données Nationales]
            UC14[Gérer tous les Établissements]
            UC15[Gérer tous les Utilisateurs]
            UC16[Gérer Modules Applicatifs]
        end
    end

    actor Agent as Agent de Santé
    actor Admin as Admin Local
    actor Superviseur as Superviseur National

    Agent --|> Admin
    Admin --|> Superviseur

    Agent --> UC1
    Agent --> UC2
    Agent --> UC3
    Agent --> UC4
    Agent --> UC5
    Agent --> UC9
    
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12

    Superviseur --> UC13
    Superviseur --> UC14
    Superviseur --> UC15
    Superviseur --> UC16
    
    UC2 -.-> UC1 : <<include>>
    UC3 -.-> UC1 : <<include>>
    UC15 -.-> UC10 : <<extend>>
```

---

## 10.3. Diagramme de Packages

Ce diagramme montre l'organisation du code source en modules logiques (packages) et leurs dépendances, reflétant la structure des dossiers dans `/src`.

```mermaid
graph TD
    subgraph "Code Source (src)"
        P_App[App.tsx]
        P_Types[types.ts]
        
        subgraph "hooks"
            P_Hooks[useModal.ts]
        end

        subgraph "components"
            P_UI[ui]
            P_Layout[layout]
            P_Pages[pages]
        end

        subgraph "pages"
            P_Admin[admin]
            P_Dashboard[DashboardPage.tsx]
            P_Consultations[ConsultationsPage.tsx]
        end
    end
    
    P_App --> P_Layout
    P_App -- "gère l'état d'authentification" --> P_Types
    
    P_Layout -- "affiche" --> P_Pages
    P_Layout -- "utilise" --> P_UI
    
    P_Pages -- "contient" --> P_Admin
    P_Pages -- "contient" --> P_Dashboard
    P_Pages -- "contient" --> P_Consultations

    P_Pages -- "utilise" --> P_UI
    P_Pages -- "utilise" --> P_Hooks
    P_Pages -- "dépend de" --> P_Types
```

---

## 10.4. Diagramme de Classes (Complet)

Ce diagramme modélise les entités de données (`types.ts`) ainsi que les principaux composants React, illustrant les relations entre la structure des données et l'interface utilisateur.

```mermaid
classDiagram
    direction TB
    
    class Enum {
        <<Enumeration>>
    }
    
    class UserRole {
        <<Enumeration>>
        SIH
        SIS_CSREF
        SIS_CSCOM
        SUPER_ADMIN
        ADMIN_LOCAL
        ...
    }
    
    class NotificationType {
        <<Enumeration>>
        STOCK
        ADMISSION
        SYSTEM
    }

    class User {
      +id: number
      +name: string
      +role: UserRole
      +establishment: string
    }

    class Etablissement {
        +name: string
        +type: string
        +location: string
    }

    class Consultation {
      +id: string
      +patientName: string
      +date: string
      +diagnosis: string
    }
    
    class Hospitalisation {
      +id: string
      +patientName: string
      +admissionDate: string
      +status: string
    }

    class EpidemiologyCase {
      +id: string
      +disease: string
      +caseDate: string
    }
    
    class Service {
        +name: string
        +head: string
    }

    class Specialite {
        +name: string
    }
    
    class Notification {
      +id: number
      +type: NotificationType
      +title: string
      +message: string
      +read: boolean
    }
    
    class ReactComponent {
      <<Component>>
    }
    
    class ConsultationsPage {
        <<Component>>
        -consultations: Consultation[]
        -filters: object
        +handleSave()
        +handleDelete()
    }
    
    class Modal {
        <<Component>>
        +isOpen: boolean
        +title: string
    }
    
    class useModal {
        <<Hook>>
        +isOpen: boolean
        +openModal()
        +closeModal()
    }

    Etablissement "1" -- "0..*" User : emploie
    Etablissement "1" -- "1..*" Service : est composé de
    Service "1" -- "0..*" Specialite : offre
    
    User "1" -- "0..*" Consultation : enregistre
    User "1" -- "0..*" Hospitalisation : gère
    User "1" -- "0..*" EpidemiologyCase : déclare

    ConsultationsPage "1" o-- "1" useModal : utilise
    ConsultationsPage "1" o-- "1" Modal : affiche
    
    User ..> UserRole
    Notification ..> NotificationType
```

---

## 10.5. Diagrammes de Séquence

### 10.5.1. Séquence : Ajout d'une Déclaration Épidémiologique

Ce diagramme montre le flux d'interactions lorsqu'un agent de santé déclare un nouveau cas épidémiologique.

```mermaid
sequenceDiagram
    actor Agent as Agent de Santé
    participant Page as EpidemiologiePage
    participant Hook as useModal
    participant ModalUI as Modal
    participant TableUI as Table

    Agent->>Page: Clic sur "Déclarer un cas"
    activate Page
    Page->>Hook: openModal()
    activate Hook
    Hook-->>Page: Met à jour `isOpen` à `true`
    deactivate Hook
    Page->>ModalUI: Affiche le modal (isOpen=true)
    activate ModalUI
    
    ModalUI-->>Agent: Affiche le formulaire de déclaration
    Agent->>ModalUI: Remplit les données du cas et clique "Enregistrer"
    
    ModalUI->>Page: Appelle `handleSave(formData)`
    deactivate ModalUI
    
    Page->>Page: Met à jour l'état `cases` avec le nouveau cas
    Page->>Hook: closeModal()
    activate Hook
    Hook-->>Page: Met à jour `isOpen` à `false`
    deactivate Hook
    
    Page-->>TableUI: Re-rendu avec la liste des cas mise à jour
    activate TableUI
    TableUI-->>Agent: Affiche le nouveau cas dans le tableau
    deactivate TableUI
    deactivate Page
```

### 10.5.2. Séquence : Supervision des Données par un Administrateur National

Ce diagramme illustre comment un superviseur national filtre les consultations pour visualiser les données d'un établissement spécifique.

```mermaid
sequenceDiagram
    actor Superviseur as Superviseur National
    participant Page as ConsultationsPage
    participant EstFilter as Filtre Établissement (Select)
    participant AdvFilters as Filtres Avancés
    participant TableUI as Table

    Superviseur->>Page: Accède à la page des consultations
    activate Page
    Page->>Page: Affiche la vue Superviseur (toutes données, filtre principal visible)
    
    Superviseur->>EstFilter: Sélectionne "Hôpital Sominé Dolo"
    activate EstFilter
    EstFilter->>Page: Appelle `handleEstablishmentFilterChange("Hôpital Sominé Dolo")`
    deactivate EstFilter
    
    Page->>Page: Met à jour l'état `filters`
    Page->>AdvFilters: Affiche les filtres avancés pour l'établissement sélectionné
    activate AdvFilters
    deactivate AdvFilters
    
    Page->>Page: `useMemo` recalcule `filteredData` basé sur les nouveaux filtres
    
    Page-->>TableUI: Re-rendu avec les données de l'hôpital Sominé Dolo
    activate TableUI
    TableUI-->>Superviseur: Affiche uniquement les consultations de l'hôpital sélectionné
    deactivate TableUI
    deactivate Page
```
