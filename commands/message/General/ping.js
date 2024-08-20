const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ping",
    type: 3,
    run: async (client, interaction, config, db) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
    
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
    
        interaction.editReply(
          `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
        );
    },
};