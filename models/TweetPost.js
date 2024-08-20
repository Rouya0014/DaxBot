const { model, Schema } = require('mongoose');

// Définir le schéma pour le tweet
const tweetSchema = new Schema({
  tweetId: {
    type: String,
    required: true,
    unique: true,  // Assurer l'unicité de l'ID du tweet
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,  // L'image peut ne pas être toujours disponible
  },
  date: {
    type: Date,
    default: Date.now,  // Date de publication du tweet
  },
});

// Créer le modèle à partir du schéma
const Tweet = model('Tweet', tweetSchema);

module.exports = Tweet;