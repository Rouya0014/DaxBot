const {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "nickname",
  description: "👤 | Définir un surnom pour un membre.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction, config, db) => {
    const targetUserId = interaction.user;
    const member = await interaction.guild.members.fetch(targetUserId);

    const modal = new ModalBuilder()
      .setCustomId("nickname")
      .setTitle("Choisir un surnom");

    const surnom = new TextInputBuilder()
      .setCustomId("surnom")
      .setLabel("Nickname")
      .setPlaceholder("Quelle surnom voulez vous mettre ?")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(surnom);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
};
