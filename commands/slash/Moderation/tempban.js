const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const ms = require("ms");
const TempbanSchema = require("../../../models/tempban");

module.exports = {
  name: "tempban",
  description: "🔨 | Banni temporairement un membre.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous souhaitez exclure.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "durée",
      description: "Durée de l'exclusion (30m, 1h, 1d).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "raison",
      description: "La raison de l'exclusion.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "BanMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
    const target = interaction.options.get("utilisateur").member;
    const duration = interaction.options.get("durée").value;
    const reason = interaction.options.get("raison")?.value || "Aucune raison fournie";

    const targetUser = await interaction.guild.members.fetch(target.id);

    if (!targetUser) {
      await interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.",
        ephemeral: true,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas bannir cet utilisateur car il a le même rôle ou un rôle plus élevé que vous.",
        ephemeral: true,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Je ne peux pas bannir cet utilisateur car il a le même rôle ou un rôle plus élevé que moi.",
        ephemeral: true,
      });
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Veuillez fournir une durée d'exclusion valide.", ephemeral: true });
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> La durée d'exclusion ne peut pas être inférieure à 5 secondes ni supérieure à 28 jours.", ephemeral: true });
      return;
    }
    const { default: prettyMs } = await import('pretty-ms');
    
    const expirationDate = new Date(Date.now() + msDuration);
    let durationInWords = prettyMs(msDuration, { verbose: true });
    durationInWords = durationInWords.replace('days', 'jours')
      .replace('day', 'jour')
      .replace('hours', 'heures')
      .replace('hour', 'heure')
      .replace('minutes', 'minutes')
      .replace('minute', 'minute')
      .replace('seconds', 'secondes')
      .replace('second', 'seconde');
    
    TempbanSchema.findOne(
      { GuildID: interaction.guild.id, UserID: target.user.id },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          await TempbanSchema.findOneAndUpdate(
            { GuildID: interaction.guild.id, UserID: target.user.id },
            {
              reason: reason,
              mod: interaction.user.id,
              guild: interaction.guild.id,
              expirationDate: expirationDate,
            },
            { new: true }
          );
        } else {
          const newTempban = new TempbanSchema({
            user: target.user.id,
            reason: reason,
            mod: interaction.user.id,
            guild: interaction.guild.id,
            expirationDate: expirationDate,
          });
          await newTempban.save();
        }
      }
    );

    await interaction.guild.members.ban(target.id, { reason: `${reason}` });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${target.user.username} a été banni pendant ${durationInWords}`,
        iconURL: `${target.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setDescription(
        `<:BanHammerIcon:1266841130998169711> **Raison** : ${reason}`
      )
      .setColor("#ee2346")
      .setTimestamp()
        .setFooter({text: `Par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        })})

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Débannir")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(cancel);

    await interaction.reply({ embeds: [embed], components: [row] });

    const mpBan = new EmbedBuilder()
      .setColor("#ee2346")
      .addFields({
        name: `<:BanHammerIcon:1266841130998169711> Vous avez été banni de  **${interaction.guild.name}** !`,
        value: `\nRaison :\n\`\`\`\n${reason}\`\`\`\nBanni par : ${interaction.user}\nJusqu'au <t:${Math.floor(expirationDate.getTime() / 1000)}:F>`,
        inline: false,
      })
      .setTimestamp()
      .setFooter({
        text: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }),
      });

      await target.send({ embeds: [mpBan] });

    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

    const logbanembed = new EmbedBuilder()
      .setAuthor({
        name: `${target.user.username}`,
        iconURL: `${target.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setThumbnail(targetUser.displayAvatarURL({ size: 512, dynamic: true }))
      .setDescription(
        `<:LogMemberMinusIcon:1088934374625509396> ${target} a été banni pendant ${durationInWords}`
      )
      .setColor("#e94349")
      .setTimestamp()
      .setFooter({ text: `ID du membre : ${target.user.id}` });

    await logChannel.send({ embeds: [logbanembed] });

    setTimeout(async () => {
      TempbanSchema.findOne(
        { guild: interaction.guild.id, user: target.user.id },
        async (err, data) => {
          if (err) throw err;

          if (data) {
            await TempbanSchema.findOneAndDelete({
              guild: interaction.guild.id,
              user: target.user.id,
            });
            await interaction.guild.members.unban(target.user.id);
          }
        }
      );
    }, msDuration);

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId === "cancel") {
        const canBan = interaction.member.permissions.has(
          PermissionsBitField.Flags.BanMembers
        );

        if (!canBan) {
          try {
            await interaction.reply({
              content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'utiliser cette commande !",
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

        TempbanSchema.findOne(
          { guild: interaction.guild.id, user: target.user.id },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              await TempbanSchema.findOneAndDelete({
                guild: interaction.guild.id,
                user: target.user.id,
              });
              await interaction.guild.members.unban(target.user.id);
            }
          }
        );

        const unban = new EmbedBuilder()
          .setAuthor({
            name: `${target.user.username} a été débanni avec succès.`,
            iconURL: `${target.displayAvatarURL({ size: 512, dynamic: true })}`,
          })
          .setColor("#278048");

        const logChannel = client.channels.cache.get("1008348408592990278");
        if (!logChannel) return;

        const logunbanembed = new EmbedBuilder()
          .setAuthor({
            name: `${target.user.username}`,
            iconURL: `${target.displayAvatarURL({ size: 512, dynamic: true })}`,
          })
          .setThumbnail(target.displayAvatarURL({ size: 512, dynamic: true }))
          .setDescription(
            `<:LogMemberPlusIcon:1088934706889887846> ${target} a été débanni`
          )
          .setColor("#43a662")
          .setTimestamp()
          .setFooter({ text: `ID du membre : ${target.user.id}` });

        await interaction.deferUpdate();
        await interaction.editReply({
          embeds: [unban],
          components: [],
        });
        await logChannel.send({ embeds: [logunbanembed] });
      }
    });
  },
};