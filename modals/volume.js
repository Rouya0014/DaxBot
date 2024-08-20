const {
  ModalBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle
} = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { Player } = require("discord-player");
const client = require("../index");
const db = require("croxydb");

module.exports = {
  id: "form",
  run: async (client, interaction, config, db) => {
    try {
      if (interaction.customId === "form") {
        const string = interaction.fields.getTextInputValue("setvolume");
        const volume = parseInt(string);
        const queue = client.distube.getQueue(interaction);
        
        if (!queue) {
          return interaction.reply({
            content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
            ephemeral: true,
          });
        }
        
        if (isNaN(volume)) {
          return interaction.reply({
            content: "<:ErrorIcon:1098685738268229754> Donnez-moi un nombre !",
            ephemeral: true,
          });
        }
        
        if (volume < 1) {
          return interaction.reply({
            content: "<:ErrorIcon:1098685738268229754> Le nombre ne doit pas être inférieur à 1.",
            ephemeral: true,
          });
        }
        
        if (volume > 100) {
          return interaction.reply({
            content: "<:ErrorIcon:1098685738268229754> Le nombre ne doit pas être supérieur à 100.",
            ephemeral: true,
          });
        }
        
        client.distube.setVolume(interaction, volume);
        
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Volume de la musique réglé avec succès sur ${volume}` })
          .setColor("278048");
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de l'envoi de votre suggestion. Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    }
  }
};