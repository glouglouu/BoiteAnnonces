import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import { IdTokenClient } from "google-auth-library";
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com"
);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Utilisateur déjà existant" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

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

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérification que l'email et le mot de passe sont envoyés
    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe sont requis" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Mot de passe incorrect" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        message: "Connexion réussie",
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
};

export const refreshAccessToken = (req: Request, res: Response): void => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: "Token de rafraîchissement manquant" });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || "refreshSecret",
    (err: jwt.VerifyErrors | null, user: any) => {
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

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Utilisation de async ici
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token Google invalide" });
      return;
    }

    // Utilisation de await pour attendre la résolution de la promesse
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com",
    });

    console.log("ticket:", ticket);

    const payload = ticket.getPayload();
    console.log("Utilisateur Google :", payload);

    const userToken = jwt.sign(
      { email: payload?.email, name: payload?.name, picture: payload?.picture },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentification Google",
      token: userToken,
      user: payload,
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification Google:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
