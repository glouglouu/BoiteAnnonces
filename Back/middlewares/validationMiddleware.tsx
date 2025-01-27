const { body, validationResult } = require('express-validator');

// Middleware pour valider les données des annonces
const validateAnnonce = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est obligatoire.')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères.'),
  
  body('description')
    .notEmpty()
    .withMessage('La description est obligatoire.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères.'),

  // Middleware pour vérifier les erreurs
  (req, res, next) => {
    const errors = validationResult(req);  // Vérifie les erreurs de validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });  // Renvoie une erreur si des validations échouent
    }
    next();  // Passe au prochain middleware si aucune erreur
  }
];

module.exports = validateAnnonce;
