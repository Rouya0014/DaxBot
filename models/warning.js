const {model, Schema} = require("mongoose");

let WarningSchema = new Schema({
    moderationId: String,
    user: String,
    reason: String,
    mod: String,
    guild: String
})

module.exports = model("Warning", WarningSchema)