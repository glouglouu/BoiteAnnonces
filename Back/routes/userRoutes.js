const express = require('express');
const passport = require('passport');
const { 
  register, 
  login, 
  logout, 
  refreshAccessToken 
} = require('../controllers/userController'); // Assurez-vous que le chemin du contrôleur est correct
const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Route pour la déconnexion
router.post('/logout', logout);

// Route pour rafraîchir le token d'accès
router.post('/refresh', refreshAccessToken);

// Authentification Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.status(200).json({ message: 'Connexion réussie via Google', user: req.user });
  }
);

// Authentification GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.status(200).json({ message: 'Connexion réussie via GitHub', user: req.user });
  }
);

// Authentification Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    res.status(200).json({ message: 'Connexion réussie via Twitter', user: req.user });
  }
);

module.exports = router;
