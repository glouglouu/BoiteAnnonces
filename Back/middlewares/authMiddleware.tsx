const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Récupérer le token Bearer depuis les en-têtes de la requête
  const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token après "Bearer"

  if (!token) {
    return res.status(401).json({ error: 'Token non fourni' }); // Si pas de token, renvoyer une erreur 401
  }

  try {
    // Vérifier le token en utilisant la clé secrète (que vous définissez dans vos variables d'environnement)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les informations de l'utilisateur à la requête (par exemple : id, email)
    req.user = decoded;

    // Passer à la prochaine fonction middleware ou route
    next();
  } catch (err) {
    // Si le token est invalide ou expiré, renvoyer une erreur 401
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = authMiddleware;
