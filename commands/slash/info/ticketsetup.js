const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { openticket } = require("../../../config.json");

module.exports = {
  name: "ticket-setup",
  description: "🔒 | Créer un message de ticket",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
  },
  category: "Info",
  
  run: async (client, interaction, config, db) => {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .addFields({
        name: "Ticket",
        value: "Interagissez avec le bouton <:MessageRequestsIcon:1182434087424770159> afin d’ouvrir un ticket !",
      })
      .setColor('#5865f2')
      .setFooter({
        text: "⚠ Tout ticket inutile sera sanctionné.",
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('Ticket')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('<:MessageRequestsIcon:1182434087424770159>')
    );

    await guild.channels.cache.get(openticket).send({
      embeds: [embed],
      components: [button],
    });

    interaction.reply({
      content: "Le message de ticket a été envoyé.",
      ephemeral: true
    });
  },
};