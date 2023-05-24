const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "🔧 | Réponses avec pong !",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    category: "General",
    
    run: async (client, interaction, config, db) => {
        await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
    },
};
