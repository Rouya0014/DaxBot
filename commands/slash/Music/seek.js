const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "seek",
  description: "🎵 | Cherchez la musique !",
  type: 1,
  options: [
    {
      name: "nombre",
      description: "Jusqu'où veux-tu aller ?",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Déplacement dans la musique réussi.` })
      .setColor("#278048");

    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });

    const number = interaction.options.getNumber("nombre");
    if (isNaN(number))
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Donne-moi un nombre valide !`,
        ephemeral: true,
      });

    const newTime = queue.currentTime + number;
    queue.seek(newTime);

    return interaction.reply({ embeds: [embed] });
  },
};