import express from "express";
import {
  createAnnonce,
  getAnnonces,
  getAnnonceDetails,
  updateAnnonce,
  deleteAnnonce,
} from "../controllers/annonceController"; // Assurez-vous que le contrôleur est correctement configuré
import multer from "multer";
import path from "path";

// Configuration de multer pour gérer les fichiers image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier de destination pour les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour les fichiers
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"));
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// Route pour créer une annonce
router.post("/", upload.single("image"), createAnnonce);

// Route pour obtenir toutes les annonces
router.get("/", getAnnonces);

// Route pour obtenir les détails d'une annonce par ID
router.get("/:id", getAnnonceDetails);

// Route pour mettre à jour une annonce par ID
router.patch("/:id", upload.single("image"), updateAnnonce);

// Route pour supprimer une annonce par ID
router.delete("/:id", deleteAnnonce);

export default router;
