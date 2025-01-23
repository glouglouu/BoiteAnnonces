const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où stocker les images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique basé sur la date
  },
});

// Validation des fichiers (formats acceptés)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers JPEG et PNG sont autorisés !'));
  }
};

// Initialisation de multer
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite : 2 Mo
  fileFilter,
});

module.exports = upload;
