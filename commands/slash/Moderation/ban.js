const { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    description: "🔨 | Banni un membre du serveur.",
    type: 1,
    options: [
      {
        name: 'utilisateur',
        description: 'L\'utilisateur que vous voulez bannir.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'raison',
        description: 'La raison pour laquelle vous voulez bannir.',
        type: ApplicationCommandOptionType.String,
      },
    ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "BanMembers"
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
      const targetUserId = interaction.options.get('utilisateur').value;
      const reason = interaction.options.get('raison')?.value || 'Aucune raison fournie';

  const targetUser = await interaction.guild.members.fetch(targetUserId);

  if (!targetUser) {
    await interaction.reply({content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.", ephemeral: true});
    return;
  }

  const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
  const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
  const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

  if (targetUserRolePosition >= requestUserRolePosition) {
    await interaction.reply(
      {content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas bannir cet utilisateur car il a le même rôle/plus haut que vous.", ephemeral: true}
    );
    return;
  }

  if (targetUserRolePosition >= botRolePosition) {
    await interaction.reply(
      {content: "<:ErrorIcon:1098685738268229754> Je ne peux pas bannir cet utilisateur car il a le même rôle/plus haut que moi.", ephemeral: true}
    );
    return;
  }

  const banembed = new EmbedBuilder()
    .setAuthor({name: `${targetUser.user.tag} a été banni`, iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
    .setDescription(`<:BanHammerIcon:1088581569901498438> **Raison** : ${reason}`)
    .setColor('#ee2346')

    const cancel = new ButtonBuilder()
			      .setCustomId('cancel')
			      .setLabel('Débannir')
			      .setStyle(ButtonStyle.Success);

          const row = new ActionRowBuilder()
			      .addComponents(cancel);
  try {
    await targetUser.ban({ reason });
    await interaction.reply({embeds: [banembed], components: [row]});

    const logChannel = client.channels.cache.get("1008348408592990278");
  if (!logChannel) return;

  const logbanembed = new EmbedBuilder()
  .setAuthor({name: `${targetUser.user.tag}`, iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
  .setThumbnail(targetUser.displayAvatarURL({size: 512, dynamic: true}))
  .setDescription(`<:LogMemberMinusIcon:1088934374625509396> ${targetUser} a été banni`)
  .setColor('#e94349')
  .setTimestamp()
  .setFooter({text: `ID du membre : ${targetUser.id}`})

  await logChannel.send({embeds: [logbanembed]})

  } catch (error) {
    console.log(`<:ErrorIcon:1098685738268229754> Il y a eu une erreur lors du ban : ${error}`);
  }

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'cancel') {
  
      const guildId = interaction.guildId; // récupérer l'ID du serveur

      const canBan = target.permissions.has(PermissionsBitField.Flags.BanMembers);

    if (!canBan) {
      try {
        await interaction.reply({
          content: `<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'utiliser cette commande !`,
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
    
      const guild = client.guilds.cache.get(guildId);
      await guild.members.unban(targetUserId); // débannir l'utilisateur

      const unban = new EmbedBuilder()
      .setAuthor({name: `${targetUser.user.tag} a été débanni avec succès.` , iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
      .setColor('#278048')

      const logChannel = client.channels.cache.get("1008348408592990278");
  if (!logChannel) return;

  const logunbanembed = new EmbedBuilder()
    .setAuthor({name: `${targetUser.user.tag}`, iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
    .setThumbnail(targetUser.displayAvatarURL({size: 512, dynamic: true}))
    .setDescription(`<:LogMemberPlusIcon:1088934706889887846> ${targetUser} a été débanni`)
    .setColor('#43a662')
    .setTimestamp()
    .setFooter({text: `ID du membre : ${targetUser.id}`})


      interaction.deferUpdate().then(() => {
        interaction.editReply({
          embeds: [unban],
          components: []
        });
        logChannel.send({embeds: [logunbanembed]})
      }).catch(console.error) 
    }
  });
  
  },
};