const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  name: "createevent",
  description: "Créer un événement Rockstar Newswire",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
  },
  category: "Info",

  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId("createevent_modal_step1")
      .setTitle("Informations de l'Événement");

    // Champs du modal
    const titleInput = new TextInputBuilder()
      .setCustomId("event_title")
      .setLabel("Titre de l'événement")
      .setPlaceholder("Entrez le titre de l'événement")
      .setStyle(TextInputStyle.Short);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("event_description")
      .setLabel("Description de l'événement")
      .setPlaceholder("Entrez la description de l'événement")
      .setStyle(TextInputStyle.Paragraph);

    const locationInput = new TextInputBuilder()
      .setCustomId("event_location")
      .setLabel("Localisation (ID du salon ou texte)")
      .setPlaceholder("Entrez l'ID du salon ou la localisation")
      .setStyle(TextInputStyle.Short);

    const imageUrlInput = new TextInputBuilder()
      .setCustomId("event_image_url")
      .setLabel("URL de l'image (facultatif)")
      .setPlaceholder("Entrez l'URL de l'image de l'événement")
      .setStyle(TextInputStyle.Short);

    // Créer des lignes d'action
    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(locationInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(imageUrlInput);

    // Ajouter les lignes au modal
    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow
    );

    // Afficher le modal
    await interaction.showModal(modal);
  },
};