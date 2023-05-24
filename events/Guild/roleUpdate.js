const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "roleUpdate",
};

client.on("roleUpdate", (oldRole, newRole) => {
  const permTranslations = {
    CreateInstantInvite: "Créer une invitation instantanée",
    KickMembers: "Expulser des membres",
    BanMembers: "Bannir des membres",
    Administrator: "Administrateur",
    ManageChannels: "Gérer les canaux",
    ManageGuild: "Gérer le serveur",
    AddReactions: "Ajouter des réactions",
    ViewAuditLog: "Voir les logs d'audit",
    PrioritySpeaker: "Orateur Prioritaire",
    Stream: "Vidéo",
    ViewChannel: "Voir le canal",
    SendMessages: "Envoyer des messages",
    SendTTSMessages: "Envoyer des messages TTS",
    ManageMessages: "Gérer les messages",
    EmbedLinks: "Intégrer des liens",
    AttachFiles: "Joindre des fichiers",
    ReadMessageHistory: "Lire l'historique des messages",
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
    ManageRoles: "Gérer les rôles",
    ManageWebhooks: "Gérer les webhooks",
    ManageEmojisAndStickers: "Gérer les émojis et les stickers",
    UseApplicationCommands: "Utiliser les slash commands",
    RequestToSpeak: "Demander à parler",
    ManageEvents: "Gérer les évènements",
    ManageThreads: "Gérer les fils",
    CreatePublicThreads: "Créers des fils publics",
    CreatePrivateThreads: "Créer des fils privés",
    UseExternalStickers: "Utiliser des stickers externe",
    SendMessagesInThreads: "Envoyer des messages dans des fils",
    UseEmbeddedActivities: "Utiliser les activités vocaux",
    ModerateMembers: "Modérer les membres",
    UseSoundboard: "Utiliser des soundboard",
    UseExternalSounds: "Utiliser des soundboard externe",
  };

  const oldPermissions = oldRole.permissions.toArray();
  const newPermissions = newRole.permissions.toArray();
  const addedPermissions = [];
  const removedPermissions = [];

  for (const permission of oldPermissions) {
    if (!newRole.permissions.has(permission)) {
      removedPermissions.push(permission);
    }
  }

  for (const permission of newPermissions) {
    if (!oldRole.permissions.has(permission)) {
      addedPermissions.push(permission);
    }
  }
  const logChannel = client.channels.cache.get("1008348408592990278");

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${newRole.name} a été mis à jours`,
      iconURL:
        "https://cdn.discordapp.com/emojis/1088933541934538855.webp?size=44&quality=lossless",
    })
    .setFooter({ text: `ID du rôle : ${newRole.id}` })
    .setTimestamp()
    .setColor("#f6a72d");

    if (oldRole.name !== newRole.name) {
      embed.setDescription(
        `**${oldRole.name} a été renommé en ${newRole.name}**`
      );
    }

  if (addedPermissions.length > 0 && removedPermissions.length > 0) {
    embed.addFields(
      {
        name: "✓ Permissions accordées :",
        value:
          "> ```" +
          addedPermissions
            .map((permission) => permTranslations[permission])
            .join(", ") + "```",
      },
      {
        name: "✘ Permissions refusées :",
        value:
          "> ```" +
          removedPermissions
            .map((permission) => permTranslations[permission])
            .join(", ") + "```",
      }
    );
  } else if (addedPermissions.length > 0 && removedPermissions.length === 0) {
    embed
      .addFields({
        name: "✓ Permissions accordées :",
        value:
          "> ```" +
          addedPermissions
            .map((permission) => permTranslations[permission])
            .join(", ") + "```",
      })
  } else if (removedPermissions.length > 0 && addedPermissions.length === 0) {
    embed
      .addFields({
        name: "✘ Permissions refusées :",
        value:
          "> ```" +
          removedPermissions
            .map((permission) => permTranslations[permission])
            .join(", ") + "```",
      })
  }

  logChannel.send({ embeds: [embed] });
});
