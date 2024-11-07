const { model, Schema } = require('mongoose');

const casinoSchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  cash: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastWork: { type: Date, default: null },
  lastSlut: { type: Date, default: null },
  lastCrime: { type: Date, default: null },
  lastRob: { type: Date, default: null }
});

// Créer un index unique composé sur userId et guildId
casinoSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('casinoSchema', casinoSchema);