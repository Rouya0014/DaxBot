const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const client = require("../../index");
const config = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isUserContextMenuCommand()) {
    // User:
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isMessageContextMenuCommand()) {
    // Message:
    const command = client.message_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }

  if (interaction.isModalSubmit()) {
    // Modals:
    const modal = client.modals.get(interaction.customId);

    if (!modal)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Something went wrong... Probably the Modal ID is not defined in the modals handler."
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });

    try {
      modal.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }

    if (!interaction.isButton()) return;
  }

  
  const Giveaway = require('../../models/giveaway');

  if (!interaction.isButton()) return;

  const { customId, message, user } = interaction;

  if (customId === 'giveaway_participation') {
      try {
          // Chercher le giveaway par l'ID du message
          const giveaway = await Giveaway.findOne({ messageId: message.id });

          if (!giveaway) {
              return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Ce giveaway est terminé ou invalide.', ephemeral: true });
          }

          if (giveaway.ended) {
              return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Ce giveaway est terminé.', ephemeral: true });
          }

          if (giveaway.paused) {
              return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Ce giveaway est actuellement en pause.', ephemeral: true });
          }

          if (giveaway.participants.includes(user.id)) {
              // Désinscrire l'utilisateur
              giveaway.participants = giveaway.participants.filter(participant => participant !== user.id);
              await giveaway.save();

              // Mettre à jour l'embed
              const participantsCount = giveaway.participants.length;
              const updatedEmbed = new EmbedBuilder()
                  .setTitle(`🎉 ${giveaway.prize} `)
                  .setDescription(`Cliquez sur le bouton <:8569awards:1236289961922138214> ci-dessous pour participer !\n\n<:DateTimeIcon:1184957483425484872> **Temps restant**: <t:${Math.floor(giveaway.endTime / 1000)}:R>`)
                  .addFields(
                      { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${participantsCount}`, inline: true },
                      { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${giveaway.winners.length > 1 ? 'Gagnants' : ' Gagnant'}`, value: `${giveaway.winners}`, inline: true },
                  )
                  .setColor('Random')
                  .setTimestamp(giveaway.endTime);

              await message.edit({ embeds: [updatedEmbed] });
              return interaction.reply({ content: 'Vous avez été désinscrit du giveaway.', ephemeral: true });
          } else {
              // Inscrire l'utilisateur
              giveaway.participants.push(user.id);
              await giveaway.save();

              // Mettre à jour l'embed
              const participantsCount = giveaway.participants.length;
              const updatedEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${giveaway.prize} `)
                .setDescription(`Cliquez sur le bouton <:8569awards:1236289961922138214> ci-dessous pour participer !\n\n<:DateTimeIcon:1184957483425484872> **Temps restant**: <t:${Math.floor(giveaway.endTime / 1000)}:R>`)
                .addFields(
                    { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${participantsCount}`, inline: true },
                    { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${giveaway.winners.length > 1 ? 'Gagnants' : ' Gagnant'}`, value: `${giveaway.winners}`, inline: true },
                )
                  .setColor('Random')
                  .setTimestamp(giveaway.endTime);

              await message.edit({ embeds: [updatedEmbed] });
              await message.edit({ embeds: [updatedEmbed] });
              return interaction.reply({ content: 'Vous avez été inscrit au giveaway ! Bonne chance !', ephemeral: true });
          }
      } catch (error) {
          console.error('Erreur lors de la gestion de l\'interaction de bouton:', error);
          if (interaction.deferred) {
              await interaction.followUp({ content: '<:ErrorIcon:1098685738268229754> Une erreur est survenue lors du traitement de votre demande.', ephemeral: true });
          } else {
              await interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Une erreur est survenue lors du traitement de votre demande.', ephemeral: true });
          }
      }
    }

  const Suggestion = require("../../models/Suggestion");
  const formatResults = require("../../utils/formatResult");

  if (!interaction.isButton() || !interaction.customId) return;

  try {
    const [type, suggestionId, action] = interaction.customId.split(".");

    if (!type || !suggestionId || !action) return;
    if (type !== "suggestion") return;

    const targetSuggestion = await Suggestion.findOne({ suggestionId });
    const targetMessage = await interaction.channel.messages.fetch(
      targetSuggestion.messageId
    );
    const targetMessageEmbed = targetMessage.embeds[0];

    if (action == "approve") {
      await interaction.deferReply({ ephemeral: true });

      if (!interaction.memberPermissions.has("Administrator")) {
        await interaction.reply({ content:
          "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'approuver la suggestion.", ephemeral: true
        });
        return;
      }
      targetSuggestion.status = "approved";

      targetMessageEmbed.data.color = 0x278048;
      targetMessageEmbed.fields[1].value =
        "<:CheckmarkIcon:1184936169377640498> Décision du staff : Approuvée.";

      await targetSuggestion.save();

      interaction.editReply("Suggestion approuvée !");

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [],
      });
    }

    if (action == "reject") {
      if (!interaction.memberPermissions.has("Administrator")) {
        await interaction.reply({content:
          "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'approuver la suggestion.", ephemeral: true
        });
        return;
      }

      const replymodal = new ModalBuilder()
        .setCustomId(`suggestion1`)
        .setTitle("Envoyer une suggestion");

      const description = new TextInputBuilder()
        .setCustomId("suggestion-response")
        .setLabel("Réponse")
        .setPlaceholder("Quelle est la raison de ce refus ?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const ActionRow = new ActionRowBuilder().addComponents(description);
      replymodal.addComponents(ActionRow);

      await interaction.showModal(replymodal);

      targetSuggestion.status = "rejected";

      targetMessageEmbed.data.color = 0xee2346;
      targetMessageEmbed.fields[1].value =
        "<:CrossIcon:1268931319639965847> Décision du staff : rejetée.";

      await targetSuggestion.save();

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [],
      });

      return;
    }

    if (action == "upvote") {
      await interaction.deferReply({ ephemeral: true });

      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        await interaction.editReply(
          "<:ErrorIcon:1098685738268229754> Vous avez déjà voté pour cette suggestion !"
        );
        return;
      }

      targetSuggestion.upvotes.push(interaction.user.id);

      await targetSuggestion.save();

      interaction.editReply("Vous avez voté pour cette suggestion !");

      targetMessageEmbed.fields[2].value = formatResults(
        targetSuggestion.upvotes,
        targetSuggestion.downvotes
      );

      targetMessage.edit({
        embeds: [targetMessageEmbed],
      });

      return;
    }

    if (action == "downvote") {
      await interaction.deferReply({ ephemeral: true });

      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        await interaction.editReply(
          "<:ErrorIcon:1098685738268229754> Vous avez déjà voté pour cette suggestion !"
        );
        return;
      }

      targetSuggestion.downvotes.push(interaction.user.id);

      await targetSuggestion.save();

      interaction.editReply("Vous avez contre cette suggestion !");

      targetMessageEmbed.fields[2].value = formatResults(
        targetSuggestion.upvotes,
        targetSuggestion.downvotes
      );

      targetMessage.edit({
        embeds: [targetMessageEmbed],
      });

      return;
    }
  } catch (error) {
    console.log(error);
  }
});
