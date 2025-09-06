# 5. Modèle de Données (TypeScript)

Ce document décrit les principales structures de données utilisées dans l'application, définies dans le fichier `src/types.ts`. Un modèle de données bien défini et centralisé est crucial pour la cohérence, la maintenabilité et la prévention des erreurs.

## 5.1. Énumérations (Enums)

### `UserRole`
Définit les rôles possibles qu'un utilisateur peut avoir au sein du système. Chaque rôle accorde des permissions et des niveaux d'accès différents.

| Valeur | Description |
|---|---|
| `SIH` | Agent du Système d'Information Hospitalier (Niveau Hôpital). |
| `SIS_CSREF` | Agent du Système d'Information Sanitaire (Niveau CSRéf). |
| `SIS_CSCOM` | Agent du Système d'Information Sanitaire (Niveau CSCOM). |
| `SIS_CABINET` | Personnel d'un cabinet médical privé. |
| `SIS_INRSP` | Agent à l'Institut National de Recherche en Santé Publique (Centralisation nationale). |
| `SUPER_ADMIN` | Super Administrateur avec un accès complet à la plateforme. |
| `ADMIN_LOCAL` | Administrateur avec des privilèges pour un établissement spécifique. |
| `MINISTERE_SIS` | Superviseur du Ministère de la Santé (accès en lecture seule). |

### `NotificationType`
Définit les différents types de notifications dans le système pour un affichage et un traitement différenciés.

| Valeur | Description |
|---|---|
| `STOCK` | Notification liée à la gestion des stocks (ex: stock faible). |
| `ADMISSION` | Notification liée à l'admission d'un patient. |
| `SYSTEM` | Notification générale du système (ex: maintenance). |

### `ResistanceLevel`
Définit les niveaux de résistance pour la surveillance de la Résistance aux Antimicrobiens (RAM).

| Valeur | Description |
|---|---|
| `SENSIBLE` | Le micro-organisme est sensible à l'antibiotique. |
| `INTERMEDIAIRE` | Sensibilité intermédiaire. |
| `RESISTANT` | Le micro-organisme est résistant à l'antibiotique. |

## 5.2. Interfaces de Données

### `User`
Représente un utilisateur authentifié dans l'application.

| Propriété | Type | Description |
|---|---|---|
| `id` | `number` | L'identifiant unique de l'utilisateur. |
| `name` | `string` | Le nom complet de l'utilisateur. |
| `role` | `UserRole` | Le rôle de l'utilisateur, qui détermine ses permissions. |
| `establishment`| `string` | L'établissement de santé auquel l'utilisateur est affilié. |

### `Consultation`
Représente une consultation médicale enregistrée.

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique de la consultation. |
| `patientId` | `string` | Identifiant du patient associé. |
| `patientName` | `string` | Nom du patient. |
| `doctorName` | `string` | Nom du médecin ou du soignant. |
| `date` | `string` | Date de la consultation. |
| `service` | `string` | Service où la consultation a eu lieu. |
| `specialty` | `string` | Spécialité médicale concernée. |
| `establishment`| `string` | Établissement où la consultation a eu lieu. |
| `diagnosis` | `string` | Diagnostic principal posé. |

### `Hospitalisation`
Représente une hospitalisation enregistrée.

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique de l'hospitalisation. |
| `patientId` | `string` | Identifiant du patient associé. |
| `patientName` | `string` | Nom du patient. |
| `admissionDate`| `string` | Date d'admission du patient. |
| `dischargeDate`| `string` (optionnel) | Date de sortie du patient. |
| `service` | `string` | Service d'hospitalisation. |
| `status` | `'Stable' \| 'En observation' \| 'Critique' \| 'Sorti'` | État clinique du patient. |
| `diagnosis` | `string` | Diagnostic principal à l'admission. |
| `establishment`| `string` | Établissement de l'hospitalisation. |

### `EpidemiologyCase`
Représente un cas déclaré pour la surveillance épidémiologique.

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique du cas. |
| `patientName` | `string` | Nom du patient (peut être anonymisé). |
| `disease` | `string` | Maladie à déclaration obligatoire. |
| `caseDate` | `string` | Date de la détection du cas. |
| `location` | `string` | Localisation du cas au sein de l'établissement. |
| `establishment`| `string` | Établissement déclarant. |

### `RAMCase`
Représente un cas déclaré pour la surveillance de la Résistance aux Antimicrobiens (RAM).

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique du cas. |
| `microorganism`| `string` | Micro-organisme identifié. |
| `antibiotic` | `string` | Antibiotique testé. |
| `resistanceLevel`| `ResistanceLevel`| Niveau de résistance constaté. |
| `sampleType` | `string` | Type de prélèvement (ex: Sang, Urine). |
| `service` | `string` | Service où le cas a été identifié. |
| `specialty` | `string` | Spécialité médicale concernée. |
| `caseDate` | `string` | Date de la déclaration du cas. |
| `laboratory` | `string` | Laboratoire ayant effectué l'analyse. |
| `establishment`| `string` | Établissement déclarant. |
| `comment` | `string` (optionnel) | Commentaire additionnel. |

### `Referencement`
Représente un référencement d'un patient entre deux établissements.

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique du référencement. |
| `patientName` | `string` | Nom du patient référé. |
| `date` | `string` | Date de la demande initiale. |
| `originEstablishment` | `string` | Établissement d'origine. |
| `destinationEstablishment` | `string` | Établissement de destination. |
| `reason` | `string` | Motif médical du référencement. |
| `service` | `string` | Service d'origine du référencement. |
| `specialty` | `string` | Spécialité médicale requise. |
| `status` | `'En attente' \| 'Accepté' \| 'Refusé' \| 'Transféré'` | Le statut actuel du référencement. |
| `updateHistory` | `ReferencementUpdate[]` | Historique des mises à jour de statut. |

### `Campagne`
Représente une campagne de santé publique.

| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant unique de la campagne. |
| `nom` | `string` | Nom de la campagne. |
| `type` | `'Vaccination' \| 'Sensibilisation' \| 'Dépistage'` | Type de campagne. |
| `service` | `string` | Service médical principal concerné. |
| `specialty` | `string` | Spécialité médicale ciblée. |
| `coordinatingBody` | `string` | Organisme coordinateur. |
| `dateDebut` | `string` | Date de début de la campagne. |
| `dateFin` | `string` | Date de fin de la campagne. |
| `status` | `'Planifiée' \| 'En cours' \| 'Terminée'` | Statut actuel de la campagne. |
| `progress` | `CampaignProgress[]` | Suivi par établissement participant. |

### `Notification`
Structure d'une notification affichée à l'utilisateur.

| Propriété | Type | Description |
|---|---|---|
| `id` | `number` | Identifiant unique de la notification. |
| `type` | `NotificationType` | Le type de la notification. |
| `title` | `string` | Le titre de la notification. |
| `message` | `string` | Le message détaillé. |
| `timestamp` | `string` | Horodatage relatif (ex: "il y a 2 minutes"). |
| `read` | `boolean` | Statut de lecture. |

## 5.3. Interfaces pour les Données de Graphiques

### `StatsData`
Structure pour les cartes de statistiques du tableau de bord.

| Propriété | Type | Description |
|---|---|---|
| `totalPatients` | `number` | Nombre total de patients. |
| `consultationsToday` | `number` | Consultations du jour. |
| `activeHospitalizations` | `number` | Patients actuellement hospitalisés. |
| `occupancyRate` | `number` | Taux d'occupation des lits (en %). |

### `ConsultationDataPoint`
Représente un point de données pour le graphique de l'historique des consultations.

| Propriété | Type | Description |
|---|---|---|
| `date` | `string` | La date du point de données. |
| `count` | `number` | Le nombre de consultations pour cette date. |

### `EpidemiologyDataPoint`
Représente un point de données pour le graphique de répartition épidémiologique.

| Propriété | Type | Description |
|---|---|---|
| `name` | `string` | Le nom de la pathologie ou de la catégorie. |
| `value`| `number` | Le nombre de cas ou la valeur associée. |