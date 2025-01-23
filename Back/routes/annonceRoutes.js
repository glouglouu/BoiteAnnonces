const express = require('express');
const { 
  createAnnonce, 
  getAnnonces, 
  getAnnonceDetails, 
  updateAnnonce, 
  deleteAnnonce 
} = require('../controllers/annonceController'); // Assurez-vous du bon chemin vers le contrôleur
const router = express.Router();

// Route pour créer une annonce
router.post('/', createAnnonce);

// Route pour obtenir toutes les annonces
router.get('/', getAnnonces);

// Route pour obtenir les détails d'une annonce par ID
router.get('/:id', getAnnonceDetails);

// Route pour mettre à jour une annonce
router.put('/:id', updateAnnonce);

// Route pour supprimer une annonce
router.delete('/:id', deleteAnnonce);

module.exports = router;
