const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, Component } = require("discord.js");
const Suggestion = require('../../../models/Suggestion');
const formatResults = require("../../../utils/formatResult");

module.exports = {
    name: "suggest",
    description: "💡 | Envoyer une suggestion.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    category: "General",
    
    run: async (client, interaction, config, db) => {

        const modal = new ModalBuilder()
            .setCustomId('suggestion')
            .setTitle('Envoyer une suggestion');

        const description = new TextInputBuilder()
            .setCustomId('suggestion-input')
            .setLabel("Description")
            .setPlaceholder("Quelle est la description de votre suggestion ?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const actionRow = new ActionRowBuilder().addComponents(description);

        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    }
};