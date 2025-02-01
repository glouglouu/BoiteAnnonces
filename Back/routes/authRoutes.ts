import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  googleAuth,
} from "../controllers/userController";
import EmailVerification from "../models/EmailVerification";

const router = Router();

// Route pour l'inscription
router.post("/register", register);

router.post("/validate", async (req, res) => {
  const { code, email } = req.body;
  const checkCode = await EmailVerification.findOne({ email });
  if (!checkCode) {
    res.status(400).json({ error: "Code non trouvé" });
    return;
  }

  if (checkCode.code !== parseInt(code)) {
    res.status(400).json({ error: "Code incorrect" });
    return;
  }

  res.status(200).json({ message: "Code correct, compte créé avec succès" });
});

// Route pour la connexion
router.post("/login", login);

// Route pour la déconnexion
router.post("/logout", logout);

// Route pour rafraîchir le token d'accès
router.post("/refresh", refreshAccessToken);

// Authentification Google (Post-login logique personnalisée dans userController)
router.post("/google", googleAuth);

// Authentification Google via Passport
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.status(200).json({
      message: "Connexion réussie via Google",
      user: req.user,
    });
  }
);

// Authentification GitHub via Passport
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }) // Permission pour l'email utilisateur
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.status(200).json({
      message: "Connexion réussie via GitHub",
      user: req.user, // Informations de l'utilisateur retournées par GitHub
    });
  }
);

export default router;
