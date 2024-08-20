const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "suggestion1",
  run: async (client, interaction) => {
      try {

        const description = interaction.fields.getTextInputValue("suggestion-response");

        const embed = new EmbedBuilder()
          .setTitle('Réponse du staff.')
          .setDescription("> " + description)
          .setColor("#5865f2");

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
      }
    }
  }