
# BoiteAnnonces

BoiteAnnonces est une plateforme permettant aux utilisateurs de publier, modifier, consulter et supprimer des annonces. Ce projet inclut une API backend RESTful et une application frontend.

## Fonctionnalités
- **Création de compte utilisateur** avec validation d'email unique.
- **Authentification utilisateur** par compte classique ou via OAuth2 (Google, GitHub, Twitter).
- **Gestion des annonces** :
  - Création, modification et suppression.
  - Consultation de la liste des annonces et des détails.
- **Déconnexion** : le token de session devient inutilisable après déconnexion.
- **Règles de sécurité** :
  - Seuls les utilisateurs authentifiés peuvent gérer leurs annonces.
  - Limitation à 10 requêtes par seconde pour créer des annonces.
- **Gestion avancée** :
  - Cache pour optimiser les requêtes à la base de données.
  - Gestion des modifications concurrentes.

---

## Prérequis
- **Node.js** (version 16 ou supérieure) https://nodejs.org/
- **MongoDB** (Cluster cloud ou local) https://www.mongodb.com/cloud/atlas/register
- Un compte GitHub et un compte Google pour tester l’authentification OAuth2.

---

## Installation

### 1. Clonez le projet
```bash
git clone <URL_DU_DEPOT_GITHUB>
cd <nom_du_dossier_cloné>
```

### 2. Backend : Configuration et installation

#### a. Installez les dépendances
```bash
cd Back
npm install
```

#### b. Configurez un cluster MongoDB
Suivez les étapes décrites plus haut pour créer un cluster MongoDB et obtenir votre URI de connexion.

#### c. Créez un fichier `.env`
Dans le dossier `Back`, créez un fichier `.env` avec le contenu suivant :
```env
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/BoiteAnnonces
JWT_SECRET=VotreCleSecreteJWT
GITHUB_CLIENT_ID=VotreIDGitHub
GITHUB_CLIENT_SECRET=VotreSecretGitHub
GOOGLE_CLIENT_ID=VotreIDGoogle
GOOGLE_CLIENT_SECRET=VotreSecretGoogle
```

#### d. Ajouter vos identifiants OAuth Google & GitHub

##### Pour Google :
1. Allez sur https://console.cloud.google.com/
2. Créez un projet ou utilisez-en un existant.
3. Activez l’API "Google+ API" si nécessaire.
4. Allez dans **Identifiants > Créer des identifiants > ID client OAuth 2.0**.
5. Configurez l'écran de consentement (obligatoire).
6. Choisissez **Application Web** comme type d'application.
7. Ajoutez `http://localhost:5000/auth/google/callback` comme URI de redirection.
8. Copiez le **Client ID** et **Client Secret** dans le fichier `.env`.

##### Pour GitHub :
1. Allez sur https://github.com/settings/developers
2. Cliquez sur **OAuth Apps > New OAuth App**.
3. Remplissez les champs :
   - Application name : BoiteAnnonces
   - Homepage URL : `http://localhost:3000`
   - Authorization callback URL : `http://localhost:5000/auth/github/callback`
4. Cliquez sur **Register application**.
5. Copiez le **Client ID** et **Client Secret** dans le fichier `.env`.

#### e. Démarrez le backend
```bash
npm run start
```

---

### 3. Frontend : Installation et configuration

#### a. Installez les dépendances
```bash
cd ../Front
npm install
```

#### b. Configurez le fichier `.env`
Dans le dossier `Front`, créez un fichier `.env` :
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

#### c. Démarrez le frontend
```bash
npm start
```

---

## Structure du projet

### Backend
[Structure backend détaillée]

### Frontend
[Structure frontend détaillée]

---

## Fonctionnement

### Authentification
- Les utilisateurs peuvent se connecter via Google, GitHub ou en créant un compte.
- Un JSON Web Token (JWT) est généré et stocké dans un cookie sécurisé.

### Gestion des annonces
- Les utilisateurs authentifiés peuvent créer, modifier ou supprimer leurs propres annonces.
- Les annonces contiennent un titre, une description et une image (JPEG/PNG).

---

## API : Documentation des endpoints

### Utilisateurs
- Inscription
- Connexion
- Déconnexion
- OAuth2 (Google, GitHub, Twitter)

### Annonces
- Création
- Liste

---

## Problèmes courants et solutions

1. **Erreur de connexion MongoDB** :
   - Vérifiez l'URI MongoDB dans le fichier `.env`.
2. **Problème avec OAuth2** :
   - Assurez-vous que les `client_id` et `client_secret` sont corrects.
   - Vérifiez que les URLs de redirection sont bien configurées dans les consoles développeur de Google et GitHub.

---

## Crédits
- **Auteurs :** Kaïs et Mathieu  
- **Contact :** kais.chelhaoui@next-u.fr ,  mathieu.buiche@next-u.fr
