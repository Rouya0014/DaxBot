const { model, Schema } = require("mongoose");

const schema = new Schema({
    Guild: String,
    channel: String,

})

module.exports = model("join-to-create", schema)