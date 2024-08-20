const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "kick",
  description: "🔨 | Expulser un membre du serveur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous voulez exclure.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "raison",
      description: "La raison pour laquelle vous voulez l'expulser.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "KickMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
    const targetUserId = interaction.options.get("utilisateur").value;
    const reason =
      interaction.options.get("raison")?.value || "Aucune raison fournie";

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.reply({
        content:
          "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.",
        ephemeral: true,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply({
        content:
          "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas expulser cet utilisateur car il a le même rôle ou un rôle plus élevé que vous.",
        ephemeral: true,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply({
        content:
          "<:ErrorIcon:1098685738268229754> Je ne peux pas expulser cet utilisateur car il a le même rôle ou un rôle plus élevé que moi.",
        ephemeral: true,
      });
      return;
    }

    const kickEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.user.username} a été expulsé`,
        iconURL: `${targetUser.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setDescription(`<:KickIcon:1266841130029547540> **Raison :** ${reason}`)
      .setColor("#ee2346")
      .setTimestamp()
      .setFooter({
        text: `Par ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        }),
      });

    const mpKick = new EmbedBuilder()
      .setColor("#ee2346")
      .addFields({
        name: `<:KickIcon:1266841130029547540> Vous avez été un expulser de  **${interaction.guild.name}** !`,
        value: `\nRaison :\n\`\`\`\n${reason}\`\`\`\nExpulsé par : ${interaction.user}`,
        inline: false,
      })
      .setTimestamp()
      .setFooter({ text: `${interaction.guild.name}` });

    try {
      await targetUser.kick({ reason });
      await interaction.reply({ embeds: [kickEmbed] });
      await targetUser.send({ embeds: [mpKick] });

      const logChannel = client.channels.cache.get("1008348408592990278");
      if (!logChannel) return;

      const logKickEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${targetUser.user.username}`,
          iconURL: `${targetUser.displayAvatarURL({
            size: 512,
            dynamic: true,
          })}`,
        })
        .setThumbnail(targetUser.displayAvatarURL({ size: 512, dynamic: true }))
        .setDescription(
          `<:LogMemberMinusIcon:1088934374625509396> ${targetUser} a été expulsé`
        )
        .setColor("#e94349")
        .setTimestamp()
        .setFooter({ text: `ID du membre : ${targetUser.id}` });

      await logChannel.send({ embeds: [logKickEmbed] });
    } catch (error) {
      console.error(
        `<:ErrorIcon:1098685738268229754> Il y a eu une erreur lors de l'expulsion : ${error}`
      );
    }
  },
};
