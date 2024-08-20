const { model, Schema } = require("mongoose");

const giveawaySchema = new Schema({
    messageId: String,
    channelId: String,
    guildId: String, // Ajoutez ce champ si ce n'est pas déjà le cas pour suivre le serveur
    prize: String,
    endTime: Number,
    participants: [String],
    winners: Number,
    ended: Boolean,
    paused: Boolean,
    pauseStartTime: Number,
});

module.exports = model('Giveaway', giveawaySchema);