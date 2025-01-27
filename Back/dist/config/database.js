"use strict";
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connecté à la base de données MongoDB');
    }
    catch (error) {
        console.error('Erreur de connexion à MongoDB :', error.message);
        process.exit(1); // Arrête l'application si la connexion échoue
    }
};
module.exports = connectDB;
