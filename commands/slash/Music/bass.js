const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "bass",
  description: "🎵 | Renforcement des basses.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Les basses ont été renforcées avec succès.` }) // Correction de "boostée" en "renforcées"
      .setColor('#278048'); // Ajout du caractère '#' pour le code couleur hexadécimal

    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });

    interaction.reply({ embeds: [embed] });
    queue.filters.add("bassboost");
  },
};