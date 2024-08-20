const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Suggestion = require('../models/Suggestion');
const formatResults = require("../utils/formatResult");

module.exports = {
  id: "suggestion",
  run: async (client, interaction) => {
    try {
      let suggestionMessage;
      const channel = interaction.guild.channels.cache.get('1066483730224529458');
      try {
        suggestionMessage = await channel.send('Une suggestion arrive.');
        await interaction.reply({ content: 'Suggestion envoyée !', ephemeral: true });
      } catch (error) {
        console.error(error);
        return;
      }

      const suggestionText = interaction.fields.getTextInputValue('suggestion-input');

      const newSuggestion = new Suggestion({
        authorId: interaction.user.id,
        guildId: interaction.guildId,
        messageId: suggestionMessage.id,
        content: suggestionText,
      });

      await newSuggestion.save();

      const suggestionEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })
        })
        .addFields([
          { name: 'Suggestion', value: "```\n" + suggestionText + "```" },
          { name: 'Status', value: '<:SearchIcon:1184957468497944657> En attente' },
          { name: 'Votes', value: formatResults() }
        ])
        .setColor('#f6a72d');

      const upvoteButton = new ButtonBuilder()
        .setEmoji('<:LikedSummaryIcon:1268926463256825857>')
        .setLabel('Pour')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

      const downvoteButton = new ButtonBuilder()
        .setEmoji('<:DislikedSummaryIcon:1268926465626603563>')
        .setLabel('Contre')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

      const approveButton = new ButtonBuilder()
        .setEmoji('<:CheckmarkIcon:1184936169377640498>')
        .setLabel('Approuvé par le staff')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

      const rejectButton = new ButtonBuilder()
        .setEmoji('<:CrossIcon:1268931319639965847>')
        .setLabel('Rejeté par le staff')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

      const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
      const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

      await suggestionMessage.edit({
        content: '',
        embeds: [suggestionEmbed],
        components: [firstRow, secondRow]
      });

    } catch (error) {
      console.error(error);
    }
  },
};