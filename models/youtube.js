const {model, Schema} = require("mongoose");

let youtubeSchema = new Schema({
    GuildID: String,
    lastVideoId: String,
})

module.exports = model("youtube", youtubeSchema)