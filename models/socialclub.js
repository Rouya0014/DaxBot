const { model, Schema } = require("mongoose");

const usersocialclubSchema = new Schema({
    discordId: { type: String, required: true },
    socialClubUsername: { type: String, required: true },
    platform: { type: String, required: true }, 
});

usersocialclubSchema.index({ discordId: 1, platform: 1 }, { unique: true });

usersocialclubSchema.index({ socialClubUsername: 1, platform: 1 }, { unique: true });

module.exports = model('socialclub', usersocialclubSchema);