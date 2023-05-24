const {model, Schema} = require("mongoose");

let TempbanSchema = new Schema({
    user: String,
    reason: String,
    mod: String,
    guild: String,
    expirationDate: {
        type: Date,
        required: true
    }
})

module.exports = model("Tempban", TempbanSchema)