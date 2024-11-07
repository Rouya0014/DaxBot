const { model, Schema } = require('mongoose');

const gtaPlusSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  date: { type: Date, default: Date.now },
  locale: String,
});

// Créer et exporter le modèle
module.exports = model('GTAPlus', gtaPlusSchema);