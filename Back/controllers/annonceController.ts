import { Request, Response } from "express";
import Annonce from "../models/Annonce"; // Assurez-vous que le modèle est correctement configuré
import User from "../models/User";

// Créer une annonce
export const createAnnonce = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, price, location, author } = req.body;
    const file = req.file;
    // Vérification des champs requis
    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !location ||
      !author ||
      !file
    ) {
      res
        .status(400)
        .json({ error: "Tous les champs sont requis, y compris l'image." });
      console.log("Erreur : Tous les champs ne sont pas fournis.");
      return;
    }
    const userWithOrders = await User.findOne({ email: author });

    if (!userWithOrders) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }

    // Créer une nouvelle annonce
    const newAnnonce = new Annonce({
      author: userWithOrders._id,
      title,
      description,
      category,
      price,
      location,
      image: file.path.replace(/\\/g, "/"), // Remplacer tous les antislashs par des slashs
    });

    // Sauvegarder dans la base de données
    await newAnnonce.save();

    console.log("Annonce créée avec succès :", newAnnonce);
    res.status(201).json({
      message: "Annonce créée avec succès",
      annonce: newAnnonce,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Obtenir toutes les annonces
export const getAnnonces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const annonces = await Annonce.find().populate("author");
    console.log("Annonces trouvées :", annonces);
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des annonces" });
  }
};

// Obtenir les détails d'une annonce
export const getAnnonceDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const annonce = await Annonce.findById(id);
    console.log("Annonce et détail de l'auteur :", annonce);

    if (!annonce) {
      res.status(404).json({ error: "Annonce introuvable" });
      console.log(`Annonce introuvable pour l'ID : ${id}`);
      return;
    }

    console.log("Annonce trouvée :", annonce);
    res.status(200).json({
      image: annonce.image,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'annonce :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Mettre à jour une annonce
export const updateAnnonce = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, price, location } = req.body;
    const file = req.file;

    const annonce = await Annonce.findById(id);

    if (!annonce) {
      res.status(404).json({ error: "Annonce introuvable" });
      console.log(`Erreur : Annonce introuvable pour l'ID : ${id}`);
      return;
    }

    annonce.title = title || annonce.title;
    annonce.description = description || annonce.description;
    annonce.category = category || annonce.category;
    annonce.price = price || annonce.price;
    annonce.location = location || annonce.location;
    if (file) {
      annonce.image = file.path;
    }

    await annonce.save();

    console.log("Annonce mise à jour avec succès :", annonce);
    res.status(200).json({
      message: "Annonce mise à jour avec succès",
      annonce,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'annonce :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Supprimer une annonce
export const deleteAnnonce = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const annonce = await Annonce.findById(id);

    if (!annonce) {
      res.status(404).json({ error: "Annonce introuvable" });
      console.log(`Erreur : Annonce introuvable pour l'ID : ${id}`);
      return;
    }

    await Annonce.deleteOne({ _id: id });

    console.log("Annonce supprimée avec succès :", id);
    res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
