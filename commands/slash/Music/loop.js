const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");
module.exports = {
  name: "loop",
  description: "🎵 | Vous bouclez la chanson !",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `La chanson a été mise en boucle avec succès.` })
      .setColor("278048");

    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });

    client.distube.setRepeatMode(interaction, 1);
    return  interaction.reply({ embeds: [embed] });
  },
};
