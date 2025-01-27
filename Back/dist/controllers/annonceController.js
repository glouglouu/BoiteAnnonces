"use strict";
const Annonce = require('../models/Annonce'); // Assurez-vous que le modèle est bien importé
// Créer une annonce
const createAnnonce = async (req, res) => {
    try {
        console.log("Données reçues pour la création de l'annonce :", req.body); // Log pour voir les données envoyées
        console.log("Fichier téléchargé :", req.file); // Log pour voir le fichier téléchargé
        const { title, description } = req.body; // Récupérer les données du corps de la requête
        const image = req.file ? req.file.path : null; // Si une image est envoyée, on récupère son chemin via Multer
        const userId = req.user.id; // Récupérer l'ID de l'utilisateur (assure-toi que l'utilisateur est authentifié)
        // Vérification des champs obligatoires
        if (!title || !description) {
            return res.status(400).json({ error: "Le titre et la description sont requis." });
        }
        // Créer l'annonce avec les données reçues, y compris l'utilisateur
        const annonce = new Annonce({
            title,
            description,
            image,
            user: userId, // Associer l'ID de l'utilisateur à l'annonce
        });
        // Sauvegarder l'annonce dans la base de données
        await annonce.save();
        console.log("Annonce créée avec succès :", annonce); // Log pour confirmer la création
        res.status(201).json({
            message: 'Annonce créée avec succès',
            annonce,
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'annonce :', error);
        res.status(500).json({ error: 'Erreur interne lors de la création de l\'annonce' });
    }
};
// Obtenir toutes les annonces
const getAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find().populate('user', 'firstName lastName'); // Peupler le champ user avec le prénom et le nom de l'utilisateur
        res.status(200).json(annonces); // Retourner les annonces sous forme de JSON
    }
    catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
    }
};
// Obtenir les détails d'une annonce par ID
const getAnnonceDetails = async (req, res) => {
    try {
        const annonce = await Annonce.findById(req.params.id).populate('user', 'firstName lastName'); // Peupler le champ user
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce introuvable' });
        }
        res.status(200).json(annonce); // Retourner l'annonce trouvée
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce :', error);
        res.status(500).json({ error: 'Erreur interne lors de la récupération de l\'annonce' });
    }
};
// Mettre à jour une annonce
const updateAnnonce = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const annonce = await Annonce.findById(id);
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce introuvable' });
        }
        // Mettre à jour les informations de l'annonce
        annonce.title = title || annonce.title;
        annonce.description = description || annonce.description;
        // Gérer l'image si elle est modifiée
        const newImage = req.file ? req.file.path : annonce.image;
        if (newImage !== annonce.image && fileExists(annonce.image)) {
            // Supprimer l'ancienne image si elle existe et a été remplacée
            await deleteFile(annonce.image);
        }
        annonce.image = newImage;
        // Sauvegarder les modifications dans la base de données
        await annonce.save();
        res.status(200).json({ message: 'Annonce mise à jour avec succès', annonce });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'annonce :', error);
        res.status(500).json({ error: 'Erreur interne lors de la mise à jour de l\'annonce' });
    }
};
// Supprimer une annonce
const deleteAnnonce = async (req, res) => {
    try {
        const { id } = req.params;
        const annonce = await Annonce.findById(id);
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce introuvable' });
        }
        // Supprimer l'image associée si elle existe
        if (fileExists(annonce.image)) {
            await deleteFile(annonce.image);
        }
        // Supprimer l'annonce de la base de données
        await annonce.remove();
        res.status(200).json({ message: 'Annonce supprimée avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'annonce :', error);
        res.status(500).json({ error: 'Erreur interne lors de la suppression de l\'annonce' });
    }
};
module.exports = {
    createAnnonce,
    getAnnonces,
    getAnnonceDetails,
    updateAnnonce,
    deleteAnnonce
};
