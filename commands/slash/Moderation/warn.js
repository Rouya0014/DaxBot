const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const warningSchema = require("../../../models/warning");
const { makeId } = require("../../../models/utils/generatedID")

module.exports = {
  name: "warn",
  description: "🔨 | Averti un membre.",
  type: 1,
  options: [
    {
      name: "user",
      description: "L'utilisateur à avertir",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "La raison de l'avertissement",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "MuteMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
    const target = interaction.options.get("user");
    const reason = interaction.options.get("reason")?.value || "Aucune raison fournie";

    const warnembed = new EmbedBuilder();

    const targetUser = await interaction.guild.members.fetch(target);
      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.reply(
          {content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas expulser cet utilisateur car il a le même rôle/plus haut que vous.", ephemeral: true}
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.reply(
          {content: "<:ErrorIcon:1098685738268229754> Je ne peux pas expulser cet utilisateur car il a le même rôle/plus haut que moi.", ephemeral: true}
        );
        return;
      }

    let id = makeId(9)
    
    warningSchema.findOne(
      { GuildID: interaction.guild.id, UserID: target.user.id },
      async (err, data) => {
        if (err) throw err;

          data = new warningSchema({
            moderationId: id,
            user: target.user.id,
            reason: reason,
            mod: interaction.user.id,
            guild: interaction.guild.id
          });
        data.save();
      }
    );

    warnembed
      .setColor("#e94349")
      .setAuthor({
        name: `${target.user.tag} a reçus un avertissement`,
        iconURL: `${target.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        })}`,
      })
      .setDescription(
        `<:ReportRaidIcon:1088579146533314631> **Raison** : ${reason}`
      )
      .setTimestamp()
      .setFooter({text: `Par ${interaction.user.tag} | ID du warn : ${id}`, iconURL: interaction.user.displayAvatarURL({
        size: 512,
        dynamic: true,
      })})

      const cancel = new ButtonBuilder()
			      .setCustomId('cancel')
			      .setLabel('Annuler l\'infraction')
			      .setStyle(ButtonStyle.Success);

          const row = new ActionRowBuilder()
			      .addComponents(cancel);

    interaction.reply({ embeds: [warnembed], components: [row] });

   const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

    const Logtwarn = new EmbedBuilder()
      .setAuthor({
        name: `${target.user.tag}`,
        iconURL: `${target.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        })}`,
      })
      .setThumbnail(target.user.displayAvatarURL({ size: 512, dynamic: true }))
      .setDescription(
        `<:LogMemberMinusIcon:1088934374625509396> <@${target.user.id}> a reçus un avertissement pour : ${reason}`
      )
      .setColor("#ee2346")
      .setTimestamp()
      .setFooter({ text: `ID du membre : ${target.user.id}` });

    await logChannel.send({ embeds: [Logtwarn] });


    client.on("interactionCreate", async interaction => {
           
      if (!interaction.isButton()) return;
      if (interaction.customId === "cancel") {
        const targetuser = interaction.member;
        const canWarn = targetuser.permissions.has(PermissionsBitField.Flags.MuteMembers);

        if (!canWarn) {
          try {
            await interaction.reply({
              content: `<:ErrorIcon:1098685738268229754>  Vous n'avez pas la permission d'utiliser cette commande !`,
              ephemeral: true
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
    
        const embed = new EmbedBuilder();
        
        warningSchema.findOne({ guild: interaction.guild.id, user: target.user.id, moderationId: id }, async (err, data) => { 
          if (err) throw err;
        
          if (data) {

            await warningSchema.findOneAndDelete({
              guild: interaction.guild.id,
              user: target.user.id,
              moderationId: id,
            })
        
            embed.setAuthor({name: `L'infraction de ${target.user.tag} a été retirée.` , iconURL: `${target.user.displayAvatarURL({size: 512, dynamic: true})}`})
            .setColor('#278048');
        
            interaction.reply({embeds: [embed]});
          }
        }).catch(console.error);
      }
    })
  },
};