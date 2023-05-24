const { ChannelType, ButtonInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,} = require('discord.js')
const client = require("../../index");
const ticketSchema = require("../../models/Ticket")
const { ticketParent, everyone, Moderator } = require("../../config.json")

module.exports = {
    name: "interactionCreate"
}

    client.on('interactionCreate', async (interaction) => {
        const { guild, member, customId, channel } = interaction
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;

        if(!["Ticket"].includes(customId)) return;

        if(!guild.members.me.permissions.has(ManageChannels))
        return interaction.reply('error')


            const modal = new ModalBuilder()
            .setCustomId('ticket')
            .setTitle('Report un probleme');

            const titre = new TextInputBuilder()
			.setCustomId('titre')
			.setLabel("Titre")
            .setPlaceholder("Quelle est le theme de votre ticket ?")
			.setStyle(TextInputStyle.Short);

		const description = new TextInputBuilder()
			.setCustomId('description')
			.setLabel("Description")
            .setPlaceholder("Expliquer votre problème ici")
			.setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(titre);
            const secondActionRow = new ActionRowBuilder().addComponents(description);
    
            modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal)
       
    })
