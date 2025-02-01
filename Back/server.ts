import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import passport from "passport"; // Import de Passport
import annonceRoutes from "./routes/annonceRoutes";
import authRoutes from "./routes/authRoutes";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

// Sécurisation des en-têtes HTTP avec Helmet
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://apis.google.com",
        "https://www.gstatic.com",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "blob:",
        "data:",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "http://localhost:5000"],
      objectSrc: ["'none'"], // N'autorise aucun objet
      frameSrc: ["'self'", "https://accounts.google.com"],
    },
  })
);

// Middleware JSON et URL-encodé
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Configuration de Multer pour les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Répertoire pour sauvegarder les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour les fichiers
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille des fichiers : 5 Mo
}).single("image");

// Middleware pour servir les fichiers statiques dans le dossier uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route pour tester l'upload de fichier
app.post("/api/upload", (req: Request, res: Response) => {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Erreur lors du téléchargement du fichier." });
    }
    res
      .status(200)
      .json({ message: "Fichier téléchargé avec succès", file: req.file });
  });
});

// Initialisation de Passport
app.use(passport.initialize());

// Utilisation des routes
app.use("/api/annonces", annonceRoutes);
app.use("/api/users", authRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.DB_URI!, { dbName: "BoiteAnnonces" })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
