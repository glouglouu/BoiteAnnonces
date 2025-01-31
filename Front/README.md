# BoiteAnnonces

BoiteAnnonces est une plateforme permettant aux utilisateurs de publier, modifier, consulter et supprimer des annonces. Ce projet inclut une API backend RESTful et une application frontend.

## Fonctionnalités
- **Création de compte utilisateur** avec validation d'email unique.
- **Authentification utilisateur** par compte classique ou via OAuth2 (Google, GitHub).
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
- **Node.js** (version 16 ou supérieure) [téléchargez ici](https://nodejs.org/)
- **MongoDB** (Cluster cloud ou local) [inscrivez-vous ici](https://www.mongodb.com/cloud/atlas/register)
- Un compte GitHub, Google et/ou Twitter pour les tests OAuth2.

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
1. Rendez-vous sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) et créez un compte.
2. Une fois connecté, cliquez sur **"Build a Database"**.
3. Sélectionnez **"Shared Cluster"** pour une utilisation gratuite.
4. Configurez votre cluster (choisissez la région la plus proche).
5. Une fois le cluster créé, accédez à **"Database Access"** et ajoutez un utilisateur avec un mot de passe.
6. Accédez à **"Network Access"** et autorisez les connexions depuis n'importe quelle adresse IP (0.0.0.0/0).
7. Retournez à **"Clusters"**, cliquez sur **"Connect"**, et copiez l'URI de connexion (exemple : `mongodb+srv://<username>:<password>@cluster0.mongodb.net/BoiteAnnonces`).

#### c. Créez un fichier `.env`
Dans le dossier `Back`, créez un fichier `.env` avec le contenu suivant :
```env
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/BoiteAnnonces
JWT_SECRET=VotreCleSecreteJWT
GITHUB_CLIENT_ID=Iv23ctQcewuO1YVw1wYp
GITHUB_CLIENT_SECRET=VotreSecretGitHub
GOOGLE_CLIENT_ID=230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=VotreSecretGoogle
```

#### d. Démarrez le backend
```bash
npm run start
```
Le backend sera accessible sur [http://localhost:5000](http://localhost:5000).

### 3. Frontend : Installation et configuration

#### a. Installez les dépendances
```bash
cd ../Front
npm install
```

#### b. Configurez le fichier `.env`
Dans le dossier `Front`, créez un fichier `.env` avec le contenu suivant :
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

#### c. Démarrez le frontend
```bash
npm start
```
Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

### Backend
```
Back/
|-- controllers/        # Contrôleurs (logique des routes)
    |-- annonceController.ts
    |-- mailSender.ts
    |-- userController.ts
|-- middlewares/        # Middleware pour la validation, la sécurité, etc.
    |-- authMiddleware.tsx
    |-- errorMiddleware.tsx
    |-- uploadMiddleware.tsx
    |-- validationMiddleware.tsx
|-- models/             # Modèles Mongoose pour MongoDB
    |-- Annonce.ts
    |-- EmailVerification.ts
    |-- User.ts
|-- routes/             # Routes de l'API REST
    |-- annonceRoutes.ts
    |-- authRoutes.ts
|-- uploads/            # Fichiers uploadés
|-- .env                # Variables d'environnement
|-- package.json        # Fichier de configuration npm
|-- server.ts           # Point d'entrée du serveur
|-- tsconfig.json       # Configuration TypeScript
```

### Frontend
```
Front/
|-- public/             # Fichiers statiques
    |-- favicon.ico
    |-- index.html
    |-- logo192.png
    |-- logo512.png
    |-- manifest.json
    |-- robots.txt
|-- src/
    |-- components/     # Composants réutilisables
        |-- Footer.tsx
        |-- GitHub-login.tsx
        |-- GitHub-logout.tsx
        |-- Google_Login.tsx
        |-- Google_Logout.tsx
        |-- Header.tsx
    |-- pages/          # Pages principales de l'application
        |-- Announcements.tsx
        |-- CreateAnnouncement.tsx
        |-- EditAnnouncement.tsx
        |-- Home.tsx
        |-- Login.tsx
        |-- Register.tsx
    |-- App.tsx         # Composant racine
    |-- index.tsx       # Point d'entrée de l'application React
    |-- Context.tsx     # Gestion du contexte global
    |-- api.js          # Gestion des appels à l'API
    |-- App.css         # Styles globaux
    |-- index.css       # Styles de base
    |-- tailwind.config.js # Configuration Tailwind CSS
    |-- tsconfig.json   # Configuration TypeScript
    |-- package.json    # Fichier de configuration npm
|-- .gitignore          # Fichiers à ignorer par git
```

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
#### Inscription
```
POST /api/users/register
Body : { firstName, lastName, email, password }
```

#### Connexion
```
POST /api/users/login
Body : { email, password }
```

#### Déconnexion
```
POST /api/users/logout
```

#### OAuth2 (Google, GitHub, Twitter)
- **Google** : `/auth/google`
- **GitHub** : `/auth/github`
- **Twitter** : `/auth/twitter`

### Annonces
#### Création
```
POST /api/annonces
Headers : { Authorization: Bearer <token> }
Body : { title, description, image }
```

#### Liste des annonces
```
GET /api/annonces
```

---

## Problèmes courants et solutions
1. **Erreur de connexion MongoDB** :
   - Vérifiez l'URI MongoDB dans le fichier `.env`.
2. **Problème avec OAuth2** :
   - Assurez-vous que les `client_id` et `client_secret` sont corrects.
   - Vérifiez les Callback URLs dans Google et GitHub.

---

## Crédits
- **Auteurs :** Kaïs et Mathieu
- **Contact :** kais.chelhaoui@next-u.fr , mathieu.buiche@next-u.fr

