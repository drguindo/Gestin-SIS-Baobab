# 10. Diagrammes de Modélisation (UML)

## 10.1. Introduction

Cette section présente une modélisation formelle de l'application via des diagrammes UML. Ces diagrammes, générés avec la syntaxe **Mermaid**, ont été mis à jour pour refléter l'architecture actuelle, y compris les fonctionnalités de référencement, de facturation et de gestion des campagnes. Ils offrent une vue académique précise du système.

---

## 10.2. Diagramme de Cas d'Utilisation

Ce diagramme illustre les interactions entre les acteurs et les fonctionnalités clés, en intégrant les nouveaux modules.

**Acteurs :**
-   **Agent Opérationnel** : Personnel de terrain (`SIH`, `SIS_CSCOM`, `SIS_CABINET`).
-   **Coordinateur de District** : Rôle de supervision locale (`SIS_CSREF`, `ADMIN_LOCAL`).
-   **Superviseur National** : Vue d'ensemble de la plateforme (`SUPER_ADMIN`, `MINISTERE_SIS`, `SIS_INRSP`).

```mermaid
graph TD
    subgraph "Système d'Information Sanitaire (SIS)"
        direction LR
        
        subgraph "Gestion Clinique"
            UC1[Gérer Dossiers Patients]
            UC2[Gérer Consultations]
            UC3[Gérer Hospitalisations]
            UC4[Initier Référencement]
            UC5[Gérer Contre-Référence]
        end
        
        subgraph "Santé Publique & Coordination"
            UC6[Déclarer Cas Épidémiologiques]
            UC_RAM[Surveiller la RAM]
            UC7[Planifier Campagne]
            UC8[Participer à une Campagne]
            UC9[Évaluer Campagne]
        end
        
        subgraph "Gestion Administrative & Supervision"
            UC10[Gérer Facturation]
            UC11[Gérer Utilisateurs Locaux]
            UC12[Superviser Données Globales]
            UC13[Analyser Données Nationales]
        end
    end

    actor Agent as "Agent Opérationnel"
    actor Coordinateur as "Coordinateur de District"
    actor Superviseur as "Superviseur National"
    
    Coordinateur --|> Agent
    Superviseur --|> Coordinateur

    Agent --> UC1
    Agent --> UC2
    Agent --> UC3
    Agent --> UC4
    Agent --> UC6
    Agent --> UC_RAM
    Agent --> UC8
    Agent --> UC10
    
    Coordinateur --> UC5
    Coordinateur --> UC7
    Coordinateur --> UC9
    Coordinateur --> UC11

    Superviseur --> UC12
    Superviseur --> UC13
    UC13 -.-> UC_RAM : <<include>>
    UC13 -.-> UC6 : <<include>>
    
    UC5 -.-> UC4 : <<extend>>
    UC8 -.-> UC7 : <<include>>
    UC9 -.-> UC7 : <<include>>
```

---

## 10.3. Diagramme de Classes (Modèle de Données Enrichi)

Ce diagramme modélise les entités de données (`types.ts`) incluant les nouvelles structures pour les modules implémentés.

```mermaid
classDiagram
    direction TB
    
    class User {
      +name: string
      +role: UserRole
      +establishment: string
    }
    
    class Patient {
      +id: string
      +name: string
      +telephone: string
    }
    
    class Referencement {
      +id: string
      +status: string
      +service: string
      +specialty: string
    }
    
    class ReferencementUpdate {
      +status: string
      +date: string
      +notes: string
    }
    
    class Facture {
      +id: string
      +total: number
      +status: string
    }
    
    class LigneFacture {
      +description: string
      +montant: number
    }
    
    class ActeMedial {
      +description: string
      +prix: number
    }
    
    class Campagne {
      +id: string
      +nom: string
      +status: string
      +service: string
      +specialty: string
    }
    
    class CampaignProgress {
      +establishment: string
      +target: number
      +achieved: number
    }

    class RAMCase {
        +id: string
        +microorganism: string
        +antibiotic: string
        +service: string
        +specialty: string
    }

    class ResistanceLevel <<enumeration>> {
      SENSIBLE
      INTERMEDIAIRE
      RESISTANT
    }
    
    User "1" -- "0..*" Referencement : initie / met à jour
    User "1" -- "0..*" Facture : crée
    User "1" -- "0..*" Campagne : planifie
    User "1" -- "0..*" RAMCase : déclare / consulte
    
    Referencement "1" *-- "1..*" ReferencementUpdate : a un historique de
    
    Facture "1" -- "1" Patient : concerne
    Facture "1" *-- "1..*" LigneFacture : contient
    LigneFacture "1" -- "1" ActeMedial : est basée sur
    
    Campagne "1" *-- "1..*" CampaignProgress : a une progression pour

    RAMCase "1" -- "1" ResistanceLevel : a un niveau
```

---

## 10.4. Diagrammes de Séquence

### 10.4.1. Séquence : Flux de Référencement et Contre-Référence

Ce diagramme montre le processus collaboratif entre un CSCOM et un CSRéf.

```mermaid
sequenceDiagram
    actor AgentCSCOM as Agent (CSCOM)
    participant PageRefCSCOM as ReferencementsPage (CSCOM)
    participant PageRefCSREF as ReferencementsPage (CSRéf)
    actor AgentCSREF as Agent (CSRéf)

    AgentCSCOM->>PageRefCSCOM: Initie un référencement
    activate PageRefCSCOM
    PageRefCSCOM->>PageRefCSCOM: Ouvre le modal de création
    AgentCSCOM->>PageRefCSCOM: Remplit et enregistre le formulaire
    PageRefCSCOM->>PageRefCSCOM: Ajoute le nouveau référencement (statut: "En attente")
    deactivate PageRefCSCOM
    
    Note right of AgentCSREF: Plus tard...

    AgentCSREF->>PageRefCSREF: Se connecte et consulte les référencements
    activate PageRefCSREF
    PageRefCSREF-->>AgentCSREF: Affiche le référencement en attente
    
    AgentCSREF->>PageRefCSREF: Met à jour le statut
    PageRefCSREF->>PageRefCSREF: Ouvre le modal de mise à jour
    AgentCSREF->>PageRefCSREF: Change le statut à "Accepté" et ajoute une note
    PageRefCSREF->>PageRefCSREF: Met à jour le référencement et son historique
    deactivate PageRefCSREF
    
    Note right of AgentCSCOM: Encore plus tard...

    AgentCSCOM->>PageRefCSCOM: Consulte le référencement
    activate PageRefCSCOM
    PageRefCSCOM-->>AgentCSCOM: Affiche le statut mis à jour ("Accepté") et la note (contre-référence)
    deactivate PageRefCSCOM
```

### 10.4.2. Séquence : Flux de Planification et Suivi d'une Campagne

Ce diagramme illustre la coordination entre un superviseur et un agent de terrain pour une campagne de santé publique.

```mermaid
sequenceDiagram
    actor Superviseur as Superviseur (CSRéf)
    participant PageCampSup as CampagnesPage (Vue Superviseur)
    participant PageCampOp as CampagnesPage (Vue Opérationnelle)
    actor Agent as Agent (CSCOM)

    Superviseur->>PageCampSup: Clique sur "Planifier une campagne"
    activate PageCampSup
    PageCampSup->>PageCampSup: Ouvre le modal de planification
    Superviseur->>PageCampSup: Définit le nom, les dates, les participants et les objectifs
    PageCampSup->>PageCampSup: Enregistre la nouvelle campagne (statut: "Planifiée")
    deactivate PageCampSup
    
    Note right of Agent: Plus tard...
    
    Agent->>PageCampOp: Se connecte et consulte les campagnes
    activate PageCampOp
    PageCampOp-->>Agent: Affiche la campagne planifiée à laquelle il doit participer
    
    Agent->>PageCampOp: Clique sur "Rapporter la progression"
    PageCampOp->>PageCampOp: Ouvre le modal de rapport
    Agent->>PageCampOp: Saisit le nombre de personnes atteintes
    PageCampOp->>PageCampOp: Met à jour la progression de son établissement pour la campagne
    deactivate PageCampOp
    
    Note right of Superviseur: Encore plus tard...
    
    Superviseur->>PageCampSup: Consulte le tableau de bord des campagnes
    activate PageCampSup
    PageCampSup-->>Superviseur: Affiche la campagne avec la barre de progression globale mise à jour
    deactivate PageCampSup
```

### 10.4.3. Séquence : Flux de Surveillance de la RAM

Ce diagramme modélise le processus de déclaration d'un cas de RAM par un agent de terrain et sa consultation/analyse par un superviseur national.

```mermaid
sequenceDiagram
    actor AgentTerrain as "Agent (Hôpital/CSCOM)"
    participant PageRAMOp as "SurveillanceRAMPage (Opérationnel)"
    participant PageRAMSup as "SurveillanceRAMPage (INRSP)"
    actor AgentINRSP as "Chargé SIS (INRSP)"

    AgentTerrain->>PageRAMOp: Clique sur "Déclarer un cas"
    activate PageRAMOp
    PageRAMOp->>PageRAMOp: Ouvre le modal de saisie
    AgentTerrain->>PageRAMOp: Remplit les informations (bactérie, antibiotique, résistance) et enregistre
    PageRAMOp->>PageRAMOp: Ajoute le nouveau cas de RAM à la liste locale
    deactivate PageRAMOp
    
    Note right of AgentINRSP: Plus tard, pour l'analyse nationale...

    AgentINRSP->>PageRAMSup: Se connecte et consulte la page RAM
    activate PageRAMSup
    PageRAMSup-->>AgentINRSP: Affiche la liste consolidée de tous les cas de RAM
    
    AgentINRSP->>PageRAMSup: Applique des filtres (par établissement, service, bactérie)
    activate PageRAMSup
    PageRAMSup->>PageRAMSup: Met à jour la table avec les données filtrées
    PageRAMSup-->>AgentINRSP: Affiche les résultats pour analyse
    deactivate PageRAMSup
    deactivate PageRAMSup
```