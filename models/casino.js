const { model, Schema } = require('mongoose');

const casinoSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  cash: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastWork: { type: Date, default: null },
  lastSlut: { type: Date, default: null },
  lastCrime: { type: Date, default: null },
  lastRob: { type: Date, default: null }
});

module.exports = model('casinoSchema', casinoSchema);