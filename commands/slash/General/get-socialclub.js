const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const socialclub = require("../../../models/socialclub");

module.exports = {
  name: "get-socialclub",
  description: "👤 | Affiche les informations Social Club d'un utilisateur.",
  type: 1,
  options: [
    {
      name: "plateforme",
      description: "La plateforme sur laquelle tu joues (PC, Xbox One, PS4).",
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
    {
      name: "utilisateur",
      description: "Mentionne un utilisateur pour afficher son pseudo Social Club.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
    {
      name: "pseudo",
      description: "Recherche un utilisateur par son pseudo Social Club.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",

  run: async (client, interaction) => {
    const pseudo = interaction.options.getString("pseudo");
    const user = interaction.options.getUser("utilisateur");
    const platformValue = interaction.options.getString("plateforme");

    const platformNames = {
      pc: "PC",
      xboxone: "Xbox One",
      xboxsx: "Xbox Série X/S",
      ps4: "PlayStation 4",
      ps5: "PlayStation 5",
    };

    if (!pseudo && !user) {
      return interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Vous devez fournir soit un pseudo Social Club, soit mentionner un utilisateur Discord.",
        ephemeral: true,
      });
    }

    const platformName = platformNames[platformValue] || platformValue;

    try {
      let socialClubUsername;

      if (pseudo) {
        socialClubUsername = pseudo;
      } else if (user) {
        const entry = await socialclub.findOne({
          discordId: user.id,
          platform: platformValue,
        });

        if (!entry) {
          return interaction.reply({
            content: `<:ErrorIcon:1098685738268229754> Aucune information Social Club trouvée pour ${user.username} sur la plateforme **${platformName}**.`,
            ephemeral: true,
          });
        }

        socialClubUsername = entry.socialClubUsername;
      }

      const baseUrl = `https://socialclub.rockstargames.com/member/${socialClubUsername}`;
      const profileUrl = `${baseUrl}/`;
      const crewUrl = `${baseUrl}/crews`;
      const careerUrl = `${baseUrl}/games/gtav/${platformValue}/career/overview/gtaonline`;
      const rewardsUrl = `${baseUrl}/games/gtav/${platformValue}/career/awards`;
      const statsUrl = `${baseUrl}/games/gtav/${platformValue}/career/stats/gtaonline/career`;
      const weaponsUrl = `${baseUrl}/games/gtav/${platformValue}/career/weapons/gtaonline`;
      const garageUrl = `${baseUrl}/games/gtav/${platformValue}/career/garage/gtaonline`;


      const embed = new EmbedBuilder()
        .setColor("#ffab00")
        .setDescription(
          `Voici les informations du compte Social Club : \`${
            socialClubUsername ? socialClubUsername : pseudo
          }\`\nsur la plateforme \`${platformName}\` :`
        )
        .addFields(
          {
            name: "<:MemberIcon:1182434186016067695> Profil",
            value: `- [Voir le profil](${profileUrl})\n- [Voir les crews](${crewUrl})`,
          },
          {
            name: "<:CustomProfileIcon:1271774582570876928> Carrière",
            value: `- [Voir la carrière](${careerUrl})\n- [Voir les statistiques](${statsUrl})\n- [Voir les armes](${weaponsUrl})\n- [Voir le garage](${garageUrl})\n- [Voir les récompenses](${rewardsUrl})`,
          }
        )
        .setFooter({
          text: `Demandé par ${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL({ size: 512, dynamic: true })}`,
        })
        .setTimestamp();

      if (user) {
        embed.setAuthor({
          name: `Informations Social Club pour ${user.username}`,
          iconURL: `${user.displayAvatarURL({ size: 512, dynamic: true })}`,
        });
      } else {
        embed.setAuthor({
          name: `Informations Social Club pour ${pseudo}`,
        });
      }
        return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Une erreur est survenue lors de la récupération des informations. Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    }
  },
};