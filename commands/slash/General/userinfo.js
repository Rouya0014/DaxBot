const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch");
const config = require("../../../config.json");
const accessToken = config.token;

module.exports = {
  name: "user-info",
  description: "👤 | Affiche les informations d'un utilisateur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "Le membre @membre",
      type: ApplicationCommandOptionType.Mentionable,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  run: async (client, interaction, config, db) => {
    const targetUserId =
      interaction.options.get("utilisateur").value || interaction.user.id;
    const user = await interaction.guild.members.fetch(targetUserId);

    const badges = {
      BotHTTPInteractions: "<:ApplicationBotIcon:1088579155425235006>",
      Staff: "<:DiscordStaffIcon:1088196752416452731>",
      Partner: "<:PartneredServerOwnerIcon:1088196879474503761>",
      BugHunterLevel1: "<:BugHunterLvl1Icon:1088197447899168908>",
      BugHunterLevel2: "<:BugHunterLvl2Icon:1088197348192157757>",
      HypeSquadOnlineHouse1: "<:HypesquadBraveryIcon:1088197230038618255>",
      HypeSquadOnlineHouse2: "<:HypesquadBrillianceIcon:1088197130230956062>",
      HypeSquadOnlineHouse3: "<:HypesquadBalanceIcon:1088197289023127642>",
      Hypesquad: "<:HypeSquadEventsIcon:1088196971967303720>",
      Quarantined: "<:YQuarantineIcon:1182047021138464809>",
      Spammer: "<:EngageDinSuspectedSpamActivIcon:1182047605715382272>",
      PremiumEarlySupporter: "<:EarlySupporterIcon:1088197788883492985>",
      TeamPseudoUser: "Team User",
      VerifiedBot: "<:Bot1:1088866460329320530><:Bot2:1088866459205251102>",
      VerifiedDeveloper: "<:EarlyBotDeveloperIcon:1088197735867498568>",
      CertifiedModerator: "<:ModeratorProgramIcon:1088196822113198202>",
      ActiveDeveloper: "<:ActiveDeveloperIcon:1088197524759785614>",
    };

    if (user.premiumSinceTimestamp) {
      const premiumDuration = Date.now() - user.premiumSinceTimestamp;
      let premiumBadge;

      if (premiumDuration >= 63115200000) {
        premiumBadge = "<:BadgeNitro24MonthsIcon:1088198183525560422>";
      } else if (premiumDuration >= 47336400000) {
        premiumBadge = "<:BadgeNitro18MonthsIcon:1088198302996103308>";
      } else if (premiumDuration >= 39447000000) {
        premiumBadge = "<:BadgeNitro15MonthsIcon:1088198391265243237>";
      } else if (premiumDuration >= 31557600000) {
        premiumBadge = "<:BadgeNitro12MonthsIcon:1088198502150053928>";
      } else if (premiumDuration >= 23668200000) {
        premiumBadge = "<:BadgeNitro9MonthsIcon:1088198753934127216>";
      } else if (premiumDuration >= 15778800000) {
        premiumBadge = "<:BadgeNitro6MonthsIcon:1088198843478319204>";
      } else if (premiumDuration >= 7889400000) {
        premiumBadge = "<:BadgeNitro3MonthsIcon:1088198934373077002>";
      } else if (premiumDuration >= 5259600000) {
        premiumBadge = "<:BadgeNitro2MonthsIcon:1088198992590024834>";
      } else {
        premiumBadge = "<:BadgeNitro1MonthsIcon:1088199053231276173>";
      }

      badges.Premium = premiumBadge;
    }

    let status = {
      online: "<:OnlineIcon:1088205258964082688>",
      idle: "<:IdleIcon:1088205270833958993>",
      dnd: "<:DndIcon:1088205283832111235>",
      offline: "<:InvisibleIcon:1088205307831930911>",
      streaming: "<:StreamingIcon:1088205294967988255>",
    };

    let status1 = {
      online: "En ligne",
      idle: "Inactif",
      dnd: "Ne pas déranger",
      offline: "Invisible",
      streaming: "En stream",
    };

    const getPresenceStatus = (status) => {
      const presence = Object.keys(status);

      switch (presence[0]) {
        case "Ordinateur":
          return "desktop";
        case "Mobile":
          return "mobile";
        case "Internet":
          return "web";
        default:
          return presence[0];
      }
    };

    const Appareil = {
      desktop: "Ordinateur",
      mobile: "Mobile",
      web: "Navigateur",
    };
    const device = {
      desktop: "<:DeviceDesktopIcon:1182434202734563349>",
      web: "<:DeviceWebIcon:1088211832537354390>",
      mobile: "<:DeviceMobileIcon:1182434531899351201>",
    };

    const roles = user.roles.cache
      .filter((role) => role.name !== "@everyone")
      .map((role) => role.toString())
      .join(", ");

    const acknowledgements = {
      fetch: {
        user(userInput) {
          try {
            if (userInput.permissions.has(PermissionsBitField.ViewChannel)) {
              return "Membre de serveur";
            }
            if (userInput.permissions.has(PermissionsBitField.KickMembers)) {
              return "Modérateur de serveur";
            }
            if (userInput.permissions.has(PermissionsBitField.Administrator)) {
              return "Administrateur du serveur";
            }
            if (userInput.id === interaction.guild.ownerId) {
              return "Propriétaire du serveur";
            }
          } catch (e) {
            return "Membre de serveur";
          }
        },
      },
    };

    const userFlags = user.user.flags
      .toArray()
      .map((flag) => badges[flag])
      .join(" ");
    const nitroBadge = badges.Premium || "";

    const embed = new EmbedBuilder()
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setAuthor({
        name: `${user.user.username}`,
        iconURL: user.user.displayAvatarURL({ size: 512, dynamic: true }),
      })
      .setColor("#5865f2")
      .addFields({
        name: "<:CopyIDIcon:1182046736135495750> Identifiant",
        value: "> " + user.user.id,
        inline: false,
      });

    if (!user.user.bot) {
      embed.addFields({
        name: "<:ShowUserProfileIcon:1266831645466431639> Avatar",
        value: `> [Télécharger](${user.displayAvatarURL({ dynamic: true })})`,
        inline: false,
      });
    }

    if (user.nickname) {
      embed.addFields({
        name: "<:EditMessageIcon:1182046725846867999> Surnom",
        value: "> " + user.nickname,
        inline: false,
      });
    }

    if (!user.user.bot) {
      if (
        (user.user.avatar && user.user.avatar.startsWith("a_")) ||
        user.premiumSinceTimestamp ||
        (await (await client.users.fetch(user.id, { force: true })).bannerURL())
      ) {
        embed.addFields({
          name: "<:MemberIcon:1182434186016067695> Badges",
          value: userFlags
            ? "> " +
              userFlags +
              " <:SubscriberNitroIcon:1088197836832788480> " +
              nitroBadge
            : "> <:SubscriberNitroIcon:1088197836832788480> " + nitroBadge,
        });
      } else {
        embed.addFields({
          name: "<:MemberIcon:1182434186016067695> Badges",
          value: userFlags ? `> ${userFlags}` : "> Aucun badge",
        });
      }
    } else {
      embed.addFields({
        name: "<:ApplicationBotIcon:1182087090708697128> Badges",
        value: "> <:App1:1249419976528367657><:App2:1249419975026806936>",
      });
    }

    if (user.presence?.status) {
      embed.addFields({
        name: `${status[user.presence.status]} Status`,
        value: "> " + status1[user.presence.status],
        inline: true,
      });
    } else {
      embed.addFields({
        name: `<:InvisibleIcon:1088205307831930911> Status`,
        value: "> Hors ligne",
      });
    }
    if (user.presence?.clientStatus) {
      for (let deviceType in user.presence.clientStatus) {
        let deviceName = Appareil[getPresenceStatus({ [deviceType]: 1 })];
        let iconName = device[getPresenceStatus({ [deviceType]: 1 })];
        embed.addFields({
          name: `${iconName} Appareil`,
          value: `> ${deviceName}`,
        });
      }
    }

    embed.addFields(
      {
        name: "<:ModeratorViewPermissionIcon:1266841134286639164> Niveau de permission",
        value: `> ${acknowledgements.fetch.user(user)}`,
      }
    );

    if (!user.user.bot) {
      embed.addFields(
        {
          name: "<:EventsChannelIcon:1182359399533121566> Création de compte",
          value: `> Le <t:${parseInt(user.user.createdTimestamp / 1000)}:F>\n> <t:${parseInt(user.user.createdTimestamp / 1000)}:R>`,
          inline: false,
        },
        {
          name: "<:ActiveEventIcon:1267788668496646155> Rejoint le serveur",
          value: `> Le <t:${parseInt(user.joinedAt / 1000)}:F>\n> <t:${parseInt(user.joinedAt / 1000)}:R>`,
        }
      );
    } else {
      embed.addFields({
        name: "<:ActiveEventIcon:1267788668496646155> Création de compte",
        value: `> Le <t:${parseInt(user.user.createdTimestamp / 1000)}:F>\n> <t:${parseInt(user.user.createdTimestamp / 1000)}:R>`,
        inline: false,
      });
    }

    if (user.roles.cache.size - 1 >= 1) {
      if (!user.user.bot) {
        embed.addFields({
          name: `<:RoleIcon:1182434525855354890> Rôles (${user.roles.cache.size - 1})`,
          value: "> " + roles,
        });
      }
    }

    if (
      !user.user.bot &&
      (await (
        await client.users.fetch(user.id, { force: true })
      ).bannerURL({ dynamic: true, size: 512 }))
    ) {
      const bannerURL = await (
        await client.users.fetch(user.id, { force: true })
      ).bannerURL({ dynamic: true, size: 512 });

      embed.addFields({
        name: "<:GuildBannerIcon:1184958200764706857> Bannière",
        value: `> [Télécharger](${bannerURL})`,
        inline: false,
      })
      .setImage(bannerURL);
    }

    interaction.reply({ embeds: [embed] });
  },
};