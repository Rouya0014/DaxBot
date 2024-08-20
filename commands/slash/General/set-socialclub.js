const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const socialclub = require('../../../models/socialclub');

module.exports = {
  name: "set-socialclub",
  description: "👤 | Enregistre ou met à jour ton pseudo Social Club.",
  type: 1,
  options: [
    {
      name: "pseudo",
      description: "Ton pseudo Social Club.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "plateforme",
      description: "La plateforme sur laquelle tu joues (pc, xboxone, ps4).",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "PC", value: "pc" },
        { name: "Xbox One", value: "xboxone" },
        { name: "Xbox Série X/S", value: "xboxsx" },
        { name: "PlayStation 4", value: "ps4" },
        { name: "PlayStation 5", value: "ps5" },
      ],
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction) => {
    const socialClubUsername = interaction.options.getString("pseudo");
    const platformValue = interaction.options.getString("plateforme");

    const platformNames = {
      "pc": "PC",
      "xboxone": "Xbox One",
      "xboxsx": "Xbox Série X/S",
      "ps4": "PlayStation 4",
      "ps5": "PlayStation 5",
    };

    const platformName = platformNames[platformValue] || platformValue;

    try {
      const existingUserWithSameUsername = await socialclub.findOne({ 
        socialClubUsername,
        discordId: { $ne: interaction.user.id } 
      });

      if (existingUserWithSameUsername) {
        return interaction.reply({ 
          content: `<:ErrorIcon:1098685738268229754> Le pseudo Social Club **${socialClubUsername}** est déjà utilisé par <@${existingUserWithSameUsername.discordId}>.`, 
          ephemeral: true 
        });
      }

      const existingEntryForSamePlatform = await socialclub.findOne({ 
        discordId: interaction.user.id,
        platform: platformValue
      });

      if (existingEntryForSamePlatform) {
        return interaction.reply({ 
          content: `<:ErrorIcon:1098685738268229754> Vous avez déjà enregistré un pseudo Social Club pour la plateforme **${platformName}**.`, 
          ephemeral: true 
        });
      }

      const newEntry = new socialclub({
        discordId: interaction.user.id,
        socialClubUsername,
        platform: platformValue
      });
      await newEntry.save();

      const embed = new EmbedBuilder()
        .setAuthor({ name: `Votre pseudo Social Club **${socialClubUsername}** a été enregistré pour la plateforme **${platformName}**.` })
        .setColor('#278048');

      interaction.reply({ 
        embeds: [embed], 
        ephemeral: true 
      });

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du pseudo Social Club:', error);
      interaction.reply({ 
        content: 'Une erreur est survenue lors de l\'enregistrement de votre pseudo. Veuillez réessayer plus tard.', 
        ephemeral: true 
      });
    }
  },
};