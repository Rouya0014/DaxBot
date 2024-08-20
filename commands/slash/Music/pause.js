const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "pause",
  description: "🎵 | Mettez la musique en pause !",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `La musique a bien été mise en pause.` })
      .setColor("#5865f2");

    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });

    if (queue.paused)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> La musique est déjà en pause.`,
        ephemeral: true,
      });

    client.distube.pause(interaction);
    return interaction.reply({ embeds: [embed] });
  },
};