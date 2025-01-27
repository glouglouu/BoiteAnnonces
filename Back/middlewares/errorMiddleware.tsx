// Middleware de gestion des erreurs
const errorMiddleware = (err, req, res, next) => {
    console.error(`Erreur : ${err.message}`); // Affiche l'erreur dans la console
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Définit un code de statut par défaut
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Cache la pile d'erreurs en production
    });
  };
  
  module.exports = errorMiddleware;
  