"use strict";
const mongoose = require('mongoose');
const annonceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est requis"],
        trim: true,
        minlength: [3, "Le titre doit contenir au moins 3 caractères"]
    },
    description: {
        type: String,
        required: [true, "La description est requise"],
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: [true, "Le prix est requis"],
        min: [0, "Le prix ne peut pas être négatif"]
    },
    category: {
        type: String,
        enum: ['tech', 'fashion', 'home', 'cars'],
        required: [true, "La catégorie est requise"]
    },
    location: {
        type: String,
        trim: true,
        default: "Non spécifiée"
    },
    favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }], // Pour marquer les annonces comme favorites par d'autres utilisateurs
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});
// Ajout d'un index pour optimiser la recherche
annonceSchema.index({ title: 'text', category: 1 });
const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;
