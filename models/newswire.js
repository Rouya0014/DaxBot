const { model, Schema } = require('mongoose');

const newswireSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  date: { type: Date, default: Date.now },
  locale: String
});

module.exports = model('Newswire', newswireSchema);