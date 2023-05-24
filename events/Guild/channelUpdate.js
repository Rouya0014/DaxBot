const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "channelUpdate"
};

client.on("channelUpdate", (oldChannel, newChannel) => {

  const permTranslations = {
    CreateInstantInvite: "Créer une invitation",
    KickMembers: "Expulser des membres",
    BanMembers: "Bannir des membres",
    Administrator: "Administrateur",
    ManageChannels: "Gérer le salon",
    ManageGuild: "Gérer le serveur",
    AddReactions: "Ajouter des réactions",
    ViewAuditLog: "Voir les logs d'audit",
    PrioritySpeaker: "Orateur Prioritaire",
    Stream: "Vidéo",
    ViewChannel: "Voir le salon",
    SendMessages: "Envoyer des messages",
    SendTTSMessages: "Envoyer des messages de synthèse vocale",
    ManageMessages: "Gérer les messages",
    EmbedLinks: "Intégrer des liens",
    AttachFiles: "Joindre des fichiers",
    ReadMessageHistory: "Voir les anciens messages",
    MentionEveryone: "Mentionner tout le monde",
    UseExternalEmojis: "Utiliser des émojis externes",
    ViewGuildInsights: "Voir les analyses du serveur",
    Connect: "Se connecter",
    Speak: "Parler",
    MuteMembers: "Muter des membres",
    DeafenMembers: "Rendre sourd des membres",
    MoveMembers: "Déplacer des membres",
    UseVAD: "Utiliser l'activité vocale",
    ChangeNickname: "Changer de pseudo",
    ManageNicknames: "Gérer les pseudos",
    ManageRoles: "Gérer les permissions",
    ManageWebhooks: "Gérer les webhooks",
    ManageEmojisAndStickers: "Gérer les émojis et les autocollants",
    UseApplicationCommands: "Utiliser les commandes de l'application",
    RequestToSpeak: "Demander à parler",
    ManageEvents: "Gérer les évènements",
    ManageThreads: "Gérer les fils",
    CreatePublicThreads: "Créers des fils publics",
    CreatePrivateThreads: "Créer des fils privés",
    UseExternalStickers: "Utiliser des autocollants externes",
    SendMessagesInThreads: "Envoyer des messages dans des fils",
    UseEmbeddedActivities: "Utiliser les activités vocaux",
    ModerateMembers: "Modérer les membres",
    UseSoundboard: "Utiliser des soundboard",
    UseExternalSounds: "Utiliser des soundboard externe",
  };

  const logChannel = client.channels.cache.get('1008348408592990278');
  if (!logChannel) return;
  
  //const embed = new EmbedBuilder()
  //.setTimestamp()
  //.setColor('#f6a72d')

  let addedPerms = [];
  let removedPerms = [];

  newChannel.permissionOverwrites.cache.forEach((overwrites, id) => {
    let oldOverwrites = oldChannel.permissionOverwrites.cache.get(id);

    if (!oldOverwrites) {
      return;
    }

    let oldPerms = oldOverwrites.allow.toArray();
    let newPerms = overwrites.allow.toArray();

    let addedPermissions = newPerms.filter((p) => !oldPerms.includes(p));
    let removedPermissions = oldPerms.filter((p) => !newPerms.includes(p));

    if (addedPermissions.length > 0) {
      let role = newChannel.guild.roles.cache.get(id);

      if (role) {
        let name = `${role.id}` || "everyone";
        let permissionNames = addedPermissions.map((permission) => permTranslations[permission]); // Modification ici

        addedPerms.push(`\`\`\`${permissionNames.join(", ")}\`\`\``);
        //embed.setDescription(`**<:LogChannelIUpdateIcon:1102984478554599514> Permissions du salon mises à jour : ${newChannel}**\nEdition des permissions pour <@&${name}>`)
        //.setFooter({text: `ID du salon : ${oldChannel.id} | ID du rôle : ${role.id}`})
      }
    }

    if (removedPermissions.length > 0) {
      let role = newChannel.guild.roles.cache.get(id);

      if (role) {
        let name = `<@&${role.id}>` || "everyone";
        let permissionNames = removedPermissions.map((permission) => permTranslations[permission]); // Modification ici

        removedPerms.push(`\`\`\`${permissionNames.join(", ")}\`\`\``);
        //embed.setDescription(`**<:LogChannelIUpdateIcon:1102984478554599514> Permissions du salon mises à jour : ${newChannel}**\nEdition des permissions pour ${name}`)
        //.setFooter({text: `ID du salon : ${oldChannel.id} | ID du rôle : ${role.id}`})
      }
    }
  });

  if (addedPerms.length > 0) {
    //embed.addFields({name: "✓ Permissions accordées :", value: "> " + addedPerms.join("\n")});
  }

  if (removedPerms.length > 0) {
    //embed.addFields({name: "✘ Permissions refusées :", value: "> " + removedPerms.join("\n")});
  }

  //logChannel.send({embeds: [embed]});
});