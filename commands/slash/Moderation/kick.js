const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "kick",
    description: "🔨 | Expulser un membre du serveur.",
    type: 1,
    options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur que vous voulez exclure.',
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
        },
        {
          name: 'raison',
          description: 'La raison pour laquelle vous voulez l\'expulser.',
          type: ApplicationCommandOptionType.String,
        },
      ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "KickMembers"
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

    const kickembed = new EmbedBuilder()
      .setAuthor({name: `${targetUser.user.tag} a été expulser`, iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
      .setDescription(`<:KickIcon:1089630381063544924> **Raison** : ${reason}`)
      .setColor('#ee2346')
    try {
      await targetUser.kick({ reason });
      await interaction.reply({embeds: [kickembed]});

      const logChannel = client.channels.cache.get("1008348408592990278");
  if (!logChannel) return;

  const Logkickembed = new EmbedBuilder()
  .setAuthor({name: `${targetUser.user.tag}`, iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
  .setThumbnail(targetUser.displayAvatarURL({size: 512, dynamic: true}))
  .setDescription(`<:LogMemberMinusIcon:1088934374625509396> ${targetUser} a été expulser`)
  .setColor('#e94349')
  .setTimestamp()
  .setFooter({text: `ID du membre : ${targetUser.id}`})

  await logChannel.send({embeds: [Logkickembed]})
    } catch (error) {
      console.log(`<:ErrorIcon:1098685738268229754> Il y a eu une erreur lors du coup de pied : ${error}`);
    }
    },
};