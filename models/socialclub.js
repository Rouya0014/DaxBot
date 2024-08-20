const { model, Schema } = require("mongoose");

const usersocialclubSchema = new Schema({
    discordId: { type: String, required: true },
    socialClubUsername: { type: String, required: true },
    platform: { type: String, required: true }, // ex: "pc", "xboxone", "ps4", "ps5"
});

// Index unique sur la combinaison de discordId et platform pour garantir qu'un utilisateur ne peut avoir qu'un seul pseudo par plateforme
usersocialclubSchema.index({ discordId: 1, platform: 1 }, { unique: true });

// Index unique sur la combinaison de socialClubUsername et platform pour garantir qu'un pseudo ne peut pas être utilisé par plusieurs utilisateurs sur la même plateforme
usersocialclubSchema.index({ socialClubUsername: 1, platform: 1 }, { unique: true });

module.exports = model('socialclub', usersocialclubSchema);