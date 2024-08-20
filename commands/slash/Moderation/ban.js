const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "🔨 | Bannir un membre du serveur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous souhaitez bannir.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "raison",
      description: "La raison pour laquelle vous souhaitez bannir.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "BanMembers",
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
          "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas bannir cet utilisateur car il a le même rôle ou un rôle plus élevé que vous.",
        ephemeral: true,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply({
        content:
          "<:ErrorIcon:1098685738268229754> Je ne peux pas bannir cet utilisateur car il a le même rôle ou un rôle plus élevé que moi.",
        ephemeral: true,
      });
      return;
    }

    const banEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.user.username} a été banni`,
        iconURL: `${targetUser.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setDescription(
        `<:BanHammerIcon:1266841130998169711> **Raison** : ${reason}`
      )
      .setColor("#ee2346")
      .setTimestamp()
      .setFooter({
        text: `Par ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        }),
      });

    const cancelButton = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Débannir")
      .setStyle(ButtonStyle.Success);

    const actionRow = new ActionRowBuilder().addComponents(cancelButton);

    const mpBan = new EmbedBuilder()
      .setColor("#ee2346")
      .addFields({
        name: `<:BanHammerIcon:1266841130998169711> Vous avez été banni de  **${interaction.guild.name}** !`,
        value: `\nRaison :\n\`\`\`\n${reason}\`\`\`\nBanni par : ${interaction.user}`,
        inline: false,
      })
      .setTimestamp()
      .setFooter({
        text: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }),
      });

    try {
      await targetUser.ban({ reason });
      await interaction.reply({ embeds: [banEmbed], components: [actionRow] });
      await targetUser.send({ embeds: [mpBan] });

      const logChannel = client.channels.cache.get("1008348408592990278");
      if (!logChannel) return;

      const logBanEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${targetUser.user.username}`,
          iconURL: `${targetUser.displayAvatarURL({
            size: 512,
            dynamic: true,
          })}`,
        })
        .setThumbnail(targetUser.displayAvatarURL({ size: 512, dynamic: true }))
        .setDescription(
          `<:LogMemberMinusIcon:1088934374625509396> ${targetUser} a été banni`
        )
        .setColor("#e94349")
        .setTimestamp()
        .setFooter({ text: `ID du membre : ${targetUser.id}` });

      await logChannel.send({ embeds: [logBanEmbed] });
    } catch (error) {
      console.log(
        `<:ErrorIcon:1098685738268229754> Il y a eu une erreur lors du bannissement : ${error}`
      );
    }

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId === "cancel") {
        const guildId = interaction.guildId; // récupérer l'ID du serveur
        const targetUser = interaction.member;
        const canBan = targetUser.permissions.has(
          PermissionsBitField.Flags.BanMembers
        );

        if (!canBan) {
          try {
            await interaction.reply({
              content: `<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'utiliser cette commande !`,
              ephemeral: true,
            });
          } catch (error) {
            if (error.code === 10062) {
              return;
            } else {
              console.error(error);
            }
          }

          return;
        }

        const guild = client.guilds.cache.get(guildId);
        await guild.members.unban(targetUserId); // débannir l'utilisateur

        const unbanEmbed = new EmbedBuilder()
          .setAuthor({
            name: `${targetUser.user.username} a été débanni avec succès.`,
            iconURL: `${targetUser.displayAvatarURL({
              size: 512,
              dynamic: true,
            })}`,
          })
          .setColor("#278048");

        const logChannel = client.channels.cache.get("1008348408592990278");
        if (!logChannel) return;

        const logUnbanEmbed = new EmbedBuilder()
          .setAuthor({
            name: `${targetUser.user.username}`,
            iconURL: `${targetUser.displayAvatarURL({
              size: 512,
              dynamic: true,
            })}`,
          })
          .setThumbnail(
            targetUser.displayAvatarURL({ size: 512, dynamic: true })
          )
          .setDescription(
            `<:LogMemberPlusIcon:1088934706889887846> ${targetUser} a été débanni`
          )
          .setColor("#43a662")
          .setTimestamp()
          .setFooter({ text: `ID du membre : ${targetUser.id}` });

        interaction
          .deferUpdate()
          .then(() => {
            interaction.editReply({
              embeds: [unbanEmbed],
              components: [],
            });
            logChannel.send({ embeds: [logUnbanEmbed] });
          })
          .catch(console.error);
      }
    });
  },
};
