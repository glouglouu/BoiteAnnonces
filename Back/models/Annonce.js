const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Annonce = mongoose.model('Annonce', annonceSchema);

module.exports = Annonce;
