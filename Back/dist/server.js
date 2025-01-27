"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Import des routes
const annonceRoutes_1 = __importDefault(require("./routes/annonceRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Chargement des variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware pour parser le JSON et les URL encodées
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Configuration CORS pour autoriser les requêtes de votre front-end
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
// Configuration de Multer pour le téléchargement de fichiers
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Type de fichier non autorisé"), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// Connexion à MongoDB
mongoose_1.default
    .connect(process.env.DB_URI || "", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log("MongoDB connecté"))
    .catch((err) => console.error("Erreur de connexion à MongoDB:", err));
// Définition des routes
app.use("/api/annonces", upload.single("image"), annonceRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
// Gestion des fichiers statiques pour les images téléchargées
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
exports.default = app;
