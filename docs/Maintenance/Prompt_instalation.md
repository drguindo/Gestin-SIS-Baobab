# 🚀 **PROMPT INSTALLATION COMPLÈTE**

## Expert Full Stack Senior Mobile-First Responsive • Installation Automatisée

* * *

## 🎯 **INSTRUCTION POUR AGENT IA**

**Vous êtes un Expert Full Stack Senior spécialisé en développement Mobile-First Responsive, ofline first. Votre mission est d'analyser complètement le projet et de réaliser une installation locale complète et fonctionnelle.**

* * *

## 📋 **MISSION COMPLÈTE À EXÉCUTER**

### **PHASE 1: ANALYSE ARCHITECTURALE COMPLÈTE**

#### 1.1 Analyser la Structure du Projet

#### **1.2 Lire la Documentation Technique**

#### **1.3 Analyser les Technologies**
* * *

### **PHASE 2: INSTALLATION AUTOMATISÉE**

#### **2.1 Utiliser le Script d'Installation Expert**

**A. Prérequis Système**
```bash
# Vérifiez et installez les prérequis :
# - Node.js 18+ (obligatoire)
# - Python 3.9+ (obligatoire)
# - Git (obligatoire)
# - Yarn (recommandé) ou npm
# - Redis (optionnel pour cache)
# Commandes vérification :
node --version # Doit être >= 18
python3 --version # Doit être >= 3.9
git --version
yarn --version || npm --version
```

**B. Installation Backend Python**
```bash
# 1. Aller dans le dossier backend :
cd /backend
# 2. Créer environnement virtuel Python :
python3 -m venv venv
# 3. Activer l'environnement virtuel :
source venv/bin/activate # Linux/macOS
# ou venv\Scripts\activate # Windows
# 4. Mettre à jour pip :
pip install --upgrade pip
# 5. Installer toutes les dépendances :
pip install -r requirements.txt
# 6. Vérifier installation critique :
python -c "import fastapi, uvicorn, supabase, pydantic; print('✅ Backend dependencies OK')"
```

**C. Installation Frontend React**
```bash
# 1. Aller dans le dossier frontend :
cd /frontend
# 2. Installer dépendances (privilégier Yarn) :
yarn install # ou npm install (si Yarn non disponible)
# 3. Vérifier installation critique :
ls node_modules/react node_modules/react-dom node_modules/axios
```

#### **2.3 Configuration Variables d'Environnement**

**Backend .env** (/backend)

### **PHASE 3: DÉMARRAGE SERVEURS LOCAUX**

#### **3.1 Démarrage Automatisé (Recommandé)**

```bash
# Script de démarrage automatique créé lors de l'installation :
./start_dev.sh
    
# Ce script démarre automatiquement :
# - Backend FastAPI sur http://localhost:8001  
# - Frontend React sur http://localhost:3000
```

#### **3.2 Démarrage Manuel (Si Nécessaire)**

**A. Démarrer Backend FastAPI**
```bash
# Dans un premier terminal :
cd /backend
source venv/bin/activate
# Démarrer le serveur avec hot reload :
uvicorn server_supabase:app --host 0.0.0.0 --port 8001 --reload
# Le backend sera disponible sur :
# - API: http://localhost:8001
# - Documentation: http://localhost:8001/docs
# - Health: http://localhost:8001/api/health
```

**B. Démarrer Frontend React**
```bash
# Dans un second terminal :
cd /frontend
# Démarrer le serveur de développement :
yarn start # ou npm start
# Le frontend sera disponible sur :
# - Application: http://localhost:3000
```

* * *

### **PHASE 4: CONFIGURATION DES COMPTES DE DÉMONSTRATION**

#### **4.1 Setup Automatique des Comptes de Test**

#### **4.2 Validation Complète des Comptes de Démonstration**

#### **4.3 Résolution Problèmes Courants**

#### **4.4 Comptes de Test Clés Disponibles**

### **PHASE 5: VALIDATION ET TESTS SYSTÈME**

#### **5.1 Validation Infrastructure Complète**

#### **5.2 Re-validation des Comptes de Démonstration (Post-Installation)**

#### **4.2 Tests Manuels Critiques**

**A. Test Backend API**
```bash
# Test santé API :
curl http://localhost:8001/api/health
# Test documentation API :
curl http://localhost:8001/docs
# Test authentification (devrait retourner erreur 400/422) :
curl -X POST http://localhost:8001/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"test","password":"test","role":"test"}'
# Test avec compte valide (si disponible) :
curl -X POST http://localhost:8001/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"medecinegen_hopital_somine_dolo","password":"Test123!","role":"medecin_generaliste"}'
```

**B. Test Frontend Application**
```bash
# Test accessibilité :
curl http://localhost:3000
# Test dans navigateur - Ouvrir :
# http://localhost:3000
```

**C. Test Connexion Supabase**
```python
# Dans l'environnement backend activé :
# cd /backend
# source venv/bin/activate
# Test connexion Supabase :
import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv('.env')
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
if url and key:
    client = create_client(url, key)
    result = client.table('users').select('count', count='exact').execute()
    print('✅ Supabase connection OK')
    print(f'Users in database: {result.count if result.data else 0}')
else:
    print('❌ Supabase config missing')
```

* * *

### **PHASE 5: TEST FONCTIONNALITÉS PRINCIPALES**

#### **5.1 Test Interface Utilisateur Moderne**

#### **5.2 Test Comptes de Démonstration**

#### **5.3 Test Modules Spécialisés**

* * *

### **PHASE 6: DIAGNOSTIC ET RÉSOLUTION PROBLÈMES**

#### **6.1 Si Problèmes d'Installation**

#### **6.2 Problèmes Courants et Solutions**

**A. "Port déjà utilisé"**
```bash
# Trouver et libérer le port :
lsof -ti :8001 | xargs kill -9 # Backend
lsof -ti :3000 | xargs kill -9 # Frontend
```

**B. "Module not found" Python**
```bash
cd /backend
source venv/bin/activate
pip install --force-reinstall -r requirements.txt
```

**C. "Package not found" Node.js**
```bash
cd /frontend
rm -rf node_modules package-lock.json yarn.lock
yarn install # ou npm install
```

**D. "Supabase connection failed"**
```bash
# Vérifier configuration .env
# Utiliser connexions MCP Supabase disponibles
# Tester avec: python test_supabase_connection.py
```

**E. "Comptes de démonstration non disponibles"**
```bash
# Si la modal "Comptes de démonstration" est vide ou n'apparaît pas :
# 1. Vérifier que le script de setup a été exécuté
ls -la /app/frontend/public/demo-accounts.json
# 2. Re-exécuter le setup si nécessaire
cd /app && python3 scripts/setup_demo_accounts.py
# 3. Redémarrer le frontend pour recharger le fichier
cd /app/frontend && yarn start
# 4. Vérifier l'accessibilité du fichier
curl http://localhost:3000/demo-accounts.json
```

**F. "Authentification échoue avec comptes démo"**
```bash
# Si les comptes de démonstration ne peuvent pas se connecter :
# 1. Vérifier la base de données Supabase
cd /app && python3 scripts/test_demo_accounts.py
# 2. Vérifier les logs backend
tail -f /var/log/supervisor/backend.log
# 3. Re-créer les comptes avec mots de passe corrects
cd /app && python3 scripts/setup_demo_accounts.py
```

* * *

### **PHASE 7: CONFIRMATION SUCCÈS INSTALLATION**

#### **7.1 Checklist Validation Finale**
```
✅ Backend FastAPI fonctionne (http://localhost:8001)
✅ Frontend React fonctionne (http://localhost:3000)  
✅ Documentation API accessible (/docs)
✅ Connexion Supabase opérationnelle
✅ 74 comptes de démonstration configurés et testés (Score >= 90%)
✅ Modal "Comptes de démonstration" accessible et fonctionnelle
✅ Authentification multi-établissements opérationnelle
✅ Dashboards spécialisés accessibles (médical, dentaire, sage-femme, etc.)
✅ Cloisonnement par établissement respecté
✅ Interface moderne responsive
✅ Services spécialisés disponibles (/api/dental, /api/midwife, /api/physio)
✅ Données médicales de test cohérentes
✅ Aucune erreur critique dans les logs
```

#### **7.2 Génération Rapport d'Installation**
```bash
# Le script de validation génère automatiquement :
# /tmp/medibaobab_validation_report.md
    
# Consultez ce rapport pour :
# - État détaillé du système
# - Métriques de performance  
# - Recommandations d'optimisation
# - Actions suivantes suggérées
```

* * *

## 🎯 **RÉSULTAT ATTENDU**

### **Après Exécution Complète de ce Prompt**

✅ **Installation Locale Fonctionnelle**
* Backend FastAPI + Supabase opérationnel sur :8001
* Frontend React moderne opérationnel sur :3000
* Documentation technique accessible
* Scripts d'automatisation fonctionnels

✅ **Comptes de Démonstration Opérationnels**
* 74 comptes multi-établissements configurés et testés
* 5 établissements créés (Hôpital, CSRéf, CSCOM, Cliniques)
* Authentification sécurisée avec bcrypt
* Modal "Comptes de démonstration" accessible sur page de connexion
* Cloisonnement multi-établissements fonctionnel
* Dashboards spécialisés par rôle (médecin, sage-femme, dentiste, etc.)

✅ **Système Validé et Testé**
* Authentification Supabase validée (Score >= 90%)
* Interface utilisateur moderne testée
* Services spécialisés accessibles (/api/dental, /api/midwife, /api/physio)
* Performance système vérifiée
* Tests de sécurité et permissions réussis

✅ **Environnement Développement Prêt**
* Configuration développement complète
* Hot reload backend et frontend
* Debugging et monitoring actifs
* Documentation développeur disponible
* Données de test médicales cohérentes

* * *

## 📚 **RESSOURCES COMPLÈTES DISPONIBLES**

### **Documentation Technique** (dans /docs/)
* **GUIDE_INSTALLATION.md** - Installation détaillée
* **GUIDE_DEVELOPPEMENT.md** - Standards développement
* **GUIDE_MAINTENANCE.md** - Maintenance production
* **GUIDE_DEPANNAGE.md** - Résolution problèmes
* **ARCHITECTURE_GENERALE.md** - Architecture système

### **Scripts Automatisés** (racine /)
* **install_medibaobab.sh** - Installation automatique
* **validate_complete_setup.sh** - Validation système
* **start_dev.sh** - Démarrage développement (créé par install)

### **Support Technique**
* Scripts de diagnostic automatisé
* FAQ problèmes courants
* Méthodologie dépannage SMARTT
* Templates rapport de bugs

* * *

## ⚡ **COMMANDES RAPIDES MÉMO**

* * *
