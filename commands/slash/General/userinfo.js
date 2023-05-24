const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, } = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch')
const config = require('../../../config.json')
const accessToken = config.token

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

        const targetUserId = interaction.options.get('utilisateur') || interaction.user;
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
            Quarantined: "Quarantined Account",
            Spammer: "Spammer User",
            PremiumEarlySupporter: "<:EarlySupporterIcon:1088197788883492985>",
            TeamPseudoUser: "Team User",
            VerifiedBot: "<:Bot1:1088866460329320530><:Bot2:1088866459205251102>",
            VerifiedDeveloper: "<:EarlyBotDeveloperIcon:1088197735867498568>",
            CertifiedModerator: "<:ModeratorProgramIcon:1088196822113198202>",
            ActiveDeveloper: "<:ActiveDeveloperIcon:1088197524759785614>",
          };
      
          let status = {
            online: "<:OnlineIcon:1088205258964082688>",
            idle: "<:IdleIcon:1088205270833958993>",
            dnd: "<:DndIcon:1088205283832111235>",
            offline: "<:InvisibleIcon:1088205307831930911>",
            streaming: "<:StreamingIcon:1088205294967988255>",
          };
      
          let status1 = {
            online: "En Ligne",
            idle: "Inactif",
            dnd: "Ne pas déranger",
            offline: "Invisible",
            streaming: "En stream",
          };
      
          const getPresenceStatus = (status) => {
            let presence = Object.keys(status);
      
            switch (Object.keys(status)[0]) {
              case "Ordinateur":
                presence = "desktop";
                break;
              case "Mobile":
                presence = "mobile";
                break;
              case "Internet":
                presence = "web";
                break;
            }
            return presence;
          };
      
          const Appareil = {
            desktop: "Ordinateur",
            mobile: "Mobile",
            web: "Internet",
          };
          const device = {
            desktop: "<:DeviceDesktopIcon:1088208300513968149>",
            web: "<:DeviceWebIcon:1088211832537354390>",
            mobile: "<:DeviceMobileIcon:1088208312270585899>",
          };
      
          const roles = user.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(", ");


        const acknowledgements = {
            fetch: {
                user(userInput) {
                    let result;

                    try {
                        if (userInput.permissions.has(PermissionsBitField.ViewChannel)) result = "Membre de serveur";
                        if (userInput.permissions.has(PermissionsBitField.KickMembers)) result = "Modérateur de serveur";
                        if (userInput.permissions.has(PermissionsBitField.Administrator)) result = "Administrateur du serveur";
                        if (userInput.id === interaction.guild.ownerId) result = "Propriétaire du serveur";

                    } catch (e) {
                        result = "Membre de serveur";
                    };

                    return result;
                }
            }
        };

        const embed = new EmbedBuilder()
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setAuthor({name: `${user.user.tag}`, iconURL: `${user.user.displayAvatarURL({size: 512, dynamic: true})}`,})
      .setColor("5865f2")
      .setImage(await (await client.users.fetch(user.id, {force: true})).bannerURL({dynamic: true, size: 512}))
      .addFields(
        { name: "<:IDIcon:1088928599349932053> Identifiant", value: "> " + user.user.id, inline: false },
        { name: "<:ShowAccountIcon:1099373291552129095> Avatar", value: `> [Télécharger](${user.displayAvatarURL({dynamic: true})})`, inline: false},
        { name: "<:EditServerProfileIcon:1088579160001233006> Surnom", value: "> " + (user.nickname ? user.nickname : `Aucun Surnom`), inline: false},
        { name: "<:BotIcon:1088577619726974997> Bot ?", value: "> " + (user.user.bot ? "Oui" : "Non"), inline: true});
    if (user.user.avatar && user.user.avatar.startsWith("a_") || user.premiumSinceTimestamp) {
      embed.addFields({ name: "<:FreeSubscriptionIcon:1098582543198077059> Badges", value: user.user.flags.toArray().map((flag) => badges[flag]).join(" ") ? "> " + user.user.flags.toArray().map((flag) => badges[flag]).join(" ") + " <:SubscriberNitroIcon:1088197836832788480>" : "> <:SubscriberNitroIcon:1088197836832788480>"});
    } else {
      if (!user.user.bot) {
      embed.addFields({ name: "<:FreeSubscriptionIcon:1098582543198077059> Badges", value: user.user.flags.toArray().map((flag) => badges[flag]).join(" ") ? `> ${user.user.flags.toArray().map((flag) => badges[flag]).join(" ")}` : "> Aucun badge"});
    } else if (user.user.bot && user.user.flags.toArray().map((flag) => badges[flag]).join(" ")){
      embed.addFields({ name: "<:FreeSubscriptionIcon:1098582543198077059> Badges", value: user.user.flags.toArray().map((flag) => badges[flag]).join(" ") ? `> ${user.user.flags.toArray().map((flag) => badges[flag]).join(" ")}` : "> Aucun badge"});
    } else {
      embed.addFields({ name: "<:FreeSubscriptionIcon:1098582543198077059> Badges", value: "> <:bot1:1098606027236188231><:bot2:1098606029312380959>"});
    }
    } 
      if (user.presence?.status) {
      embed.addFields({ name: `${status[user.presence.status]} Status`, value: "> " + status1[user.presence.status], inline: true})
    } else {
      embed.addFields({ name: `<:InvisibleIcon:1088205307831930911> Status`, value: "> Hors ligne"});
    }
    if (user.presence?.clientStatus) {
      for (let deviceType in user.presence.clientStatus) {
        let deviceName = Appareil[getPresenceStatus({[deviceType]: 1})[0]];
        let iconName = device[getPresenceStatus({[deviceType]: 1})[0]];
      embed.addFields({ name: `${iconName} Appareil`, value: `> ${deviceName}`});
      }
    } else {
      embed.addFields({ name: `<:DeviceOfflineIcon:1088211846869295165> Appareil`, value: `> Connecté sur aucun appareil`});
    }
      embed.addFields(
        { name: "<:MembersIcon:1088577646339829830> Niveau de permission", value: `> ${acknowledgements.fetch.user(user)}`},
        { name: "<:EventsChannelIcon:1088579023149486230> Création de compte", value: `> Le <t:${parseInt(user.user.createdTimestamp / 1000)}:F>\n> <t:${parseInt(user.user.createdTimestamp / 1000)}:R>`, inline: false},
        { name: "<:EventsChannelIcon:1088579023149486230> Rejoint le serveur", value: `> Le <t:${parseInt(user.joinedAt / 1000)}:F>\n> <t:${parseInt(user.joinedAt / 1000)}:R>`})
      if (user.roles.cache.size-1 >= 1) {
        if(!user.user.bot) {
      embed.addFields({ name: `<:RoleIcon:1088855630942584943> Rôles (${user.roles.cache.size-1})`, value: "> " + roles})
        }  
      }
      if (await (await client.users.fetch(user.id, {force: true})).bannerURL({dynamic: true, size: 512})) {
      embed.addFields({ name: "<:StickersIcon:1088928606182445186> Bannière", value: `> [Télécharger](${await (await client.users.fetch(user.id, {force: true})).bannerURL({dynamic: true, size: 512})})`, inline: false})
      }
    interaction.reply({ embeds: [embed], ephemeral: true });

    },
};