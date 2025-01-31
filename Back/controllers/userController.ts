import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import { IdTokenClient } from "google-auth-library";
import { OAuth2Client } from "google-auth-library";
import MailSender from "./mailSender";
import VerificationCode from "../models/EmailVerification";
import crypto from "crypto";

const client = new OAuth2Client(
  "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com"
);

// Ajout des variables d'environnement pour GitHub
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Iv23ctQcewuO1YVw1wYp";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "YOUR_CLIENT_SECRET";

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

    const code = crypto.randomInt(100000, 999999);

    const emailToVerify = new VerificationCode({
      email,
      code,
      expiresAt: new Date(Date.now() + 60 * 10),
    });

    await emailToVerify.save();

    try {
      MailSender(email, code);
    } catch (_error) {
      res.status(500).json({ error: "Erreur lors de l'envoi du mail" });
    }

    res.status(200).json({
      message:
        "Un code de vérification à été envoyé à l'adresse email spécifiée",
      email: email,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

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

    res.status(200).json({
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

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token Google invalide" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "230868182843-n3kdq47lln9huckb89injhr5itb4ggg1.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();

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

// **Ajout de la méthode pour GitHub**
export const githubAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ error: "Code GitHub manquant" });
      return;
    }

    // Échanger le code GitHub contre un access token
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      res.status(400).json({ error: "Échec de l'obtention du token GitHub" });
      return;
    }

    // Récupérer les infos utilisateur depuis l'API GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    res.status(200).json({
      message: "Authentification réussie via GitHub",
      user: userData,
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification GitHub :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
