const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

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

            const titre = new TextInputBuilder()
			.setCustomId('titre')
			.setLabel("Titre")
            .setPlaceholder("Quelle est le titre de votre suggestion ?")
			.setStyle(TextInputStyle.Short);

		const description = new TextInputBuilder()
			.setCustomId('description')
			.setLabel("Description")
            .setPlaceholder("Quelle est la description de votre suggestion ?")
			.setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(titre);
            const secondActionRow = new ActionRowBuilder().addComponents(description);
    
            modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal)
    },
};
