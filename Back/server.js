const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');  // Assure-toi que Multer est bien importé
const annonceRoutes = require('./routes/annonceRoutes'); // Import des routes annonces
const userRoutes = require('./routes/userRoutes'); // Import des routes utilisateurs (si nécessaire)
const path = require('path');

dotenv.config();

// Créer une instance d'Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS pour permettre les requêtes du frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Configuration de Multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Le dossier pour enregistrer les images téléchargées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Générer un nom unique pour chaque fichier
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Le fichier est accepté
  } else {
    cb(new Error('Type de fichier non autorisé'), false);  // Le fichier est rejeté
  }
};

const upload = multer({ storage, fileFilter });

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/annonces', upload.single('image'), annonceRoutes);  // Utilisation de Multer pour l'upload des images dans la route
app.use('/api/users', userRoutes);  // Routes pour les utilisateurs

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
