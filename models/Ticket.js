const {model, Schema} = require("mongoose");

let ticketSchema = new Schema({
    GuildID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Claimed: Boolean,
    Type: String,
    ClaimedBy: String,
})

module.exports = model("Ticket", ticketSchema)