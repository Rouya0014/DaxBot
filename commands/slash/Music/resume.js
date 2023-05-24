const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "resume",
  description: "🎵 | Reprenez la musique !",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `La musique a repris avec succès.` })
      .setColor("278048");

    const queue = client.distube.getQueue(interaction);
    if (queue.paused === false)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> La musique joue déjà.`,
        ephemeral: true,
      });

    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
    interaction.reply({ embeds: [embed] });
    queue.resume();
  },
};
