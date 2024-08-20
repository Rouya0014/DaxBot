const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "volume",
  description: "🎵 | Réglez le volume de la musique !",
  type: 1,
  options: [
    {
      name: "nombre",
      description: "1-100",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    const volume = interaction.options.get("nombre").value;
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Le volume de la musique a été réglé à **${volume}**.` })
      .setColor("#278048");

    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
    if (isNaN(volume))
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Donnez-moi un nombre valide !`,
        ephemeral: true,
      });
    if (volume < 1)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Le nombre ne doit pas être inférieur à 1.`,
        ephemeral: true,
      });
    if (volume > 100)
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Le nombre ne doit pas être supérieur à 100.`,
        ephemeral: true,
      });

    client.distube.setVolume(interaction, volume);
    return interaction.reply({ embeds: [embed] });
  },
};