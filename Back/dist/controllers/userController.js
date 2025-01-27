"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Assurez-vous que le modèle User existe
// Inscription d'un utilisateur
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Vérification des champs requis
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Utilisateur déjà existant" });
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
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "Utilisateur créé avec succès", token });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
// Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérification que l'email et le mot de passe sont envoyés
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email et mot de passe sont requis" });
        }
        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }
        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }
        // Générer un token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Connexion réussie", token });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
// Déconnexion d'un utilisateur
const logout = (req, res) => {
    try {
        // Supprimer le cookie contenant le token
        res.clearCookie("token");
        res.status(200).json({ message: "Déconnexion réussie" });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
};
// Rafraîchissement du token d'accès
const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ error: "Token de rafraîchissement manquant" });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ error: "Token de rafraîchissement invalide" });
        }
        const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ accessToken: newAccessToken });
    });
};
module.exports = { register, login, logout, refreshAccessToken };
