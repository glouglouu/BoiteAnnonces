import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User"; // Assurez-vous que le modèle User existe et est correctement importé

// Inscription d'un utilisateur
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Utilisateur déjà existant" });
      return;
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Utilisateur créé avec succès", token });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérification que l'email et le mot de passe sont envoyés
    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe sont requis" });
      return;
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Utilisateur non trouvé" });
      return;
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Mot de passe incorrect" });
      return;
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Déconnexion d'un utilisateur
export const logout = (req: Request, res: Response): void => {
  try {
    // Supprimer le cookie contenant le token
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
};

// Rafraîchissement du token d'accès
export const refreshAccessToken = (req: Request, res: Response): void => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: "Token de rafraîchissement manquant" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || "refreshSecret",
    (err: jwt.VerifyErrors | null, user: any) => { // Ajout des types ici
      if (err) {
        res.status(403).json({ error: "Token de rafraîchissement invalide" });
        return;
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ accessToken: newAccessToken });
    }
  );
};
