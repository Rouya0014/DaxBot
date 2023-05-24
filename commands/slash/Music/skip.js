const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "skip",
  description: "🎵 | Vous skipez la chanson !",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `La chanson a été skip avec succès.` })
      .setColor("278048");

    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
    if (queue.songs.length === 1)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Aucune chanson trouvée dans la file d'attente !`,
        ephemeral: true,
      });
    client.distube.skip(interaction);
    return interaction.reply({ embeds: [embed] });
  },
};
