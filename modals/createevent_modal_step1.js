const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require("../index");

module.exports = {
  id: "createevent_modal_step1",
  run: async (client, interaction) => {
    const title = interaction.fields.getTextInputValue("event_title");
    const description = interaction.fields.getTextInputValue("event_description");
    const location = interaction.fields.getTextInputValue("event_location");
    const imageUrl = interaction.fields.getTextInputValue("event_image_url");

    try {
      // Stocker les informations pour utilisation ultérieure
      client.eventCreationData = { title, description, location, imageUrl };

      // Créer un bouton pour poursuivre le processus
      const continueButton = new ButtonBuilder()
        .setCustomId('continue_to_step2')
        .setLabel('Continuer la création')
        .setStyle(ButtonStyle.Primary);

      const buttonRow = new ActionRowBuilder().addComponents(continueButton);

      // Répondre avec un message contenant le bouton
      await interaction.reply({ 
        content: "La première partie des informations a bien été prise en compte. Cliquez sur le bouton pour continuer.",
        components: [buttonRow], 
        ephemeral: true 
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors du traitement de votre demande.", ephemeral: true });
    }
  }
};

client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'continue_to_step2') {
      try {
          const modal = new ModalBuilder()
              .setCustomId("createevent_modal_step2")
              .setTitle("Dates de l'Événement");

          const startDateInput = new TextInputBuilder()
              .setCustomId("event_start_date")
              .setLabel("Date de début (DD/MM/AAAA)")
              .setPlaceholder("Entrez la date de début de l'événement")
              .setStyle(TextInputStyle.Short);

          const startTimeInput = new TextInputBuilder()
              .setCustomId("event_start_time")
              .setLabel("Heure de début (HH:MM)")
              .setPlaceholder("Entrez l'heure de début de l'événement")
              .setStyle(TextInputStyle.Short);

          const endDateInput = new TextInputBuilder()
              .setCustomId("event_end_date")
              .setLabel("Date de fin (DD/MM/AAAA)")
              .setPlaceholder("Entrez la date de fin de l'événement")
              .setStyle(TextInputStyle.Short);

          const endTimeInput = new TextInputBuilder()
              .setCustomId("event_end_time")
              .setLabel("Heure de fin (HH:MM)")
              .setPlaceholder("Entrez l'heure de fin de l'événement")
              .setStyle(TextInputStyle.Short);

          const firstActionRow = new ActionRowBuilder().addComponents(startDateInput);
          const secondActionRow = new ActionRowBuilder().addComponents(startTimeInput);
          const thirdActionRow = new ActionRowBuilder().addComponents(endDateInput);
          const fourthActionRow = new ActionRowBuilder().addComponents(endTimeInput);

          modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

          // Afficher le modal pour les dates
          await interaction.showModal(modal);
          

      } catch (error) {
          console.error("Erreur lors de l'affichage du modal:", error);
          await interaction.reply({ content: ":ErrorIcon:1098685738268229754> Une erreur est survenue lors de la tentative de continuer le processus.", ephemeral: true });
      }
  }
});