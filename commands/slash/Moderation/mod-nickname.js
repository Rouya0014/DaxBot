const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "mod-nickname",
    description: "🔨 | Changer le pseudo d'un membre.",
    type: 1,
    options: [
        {
          name: 'utilisateur',
          description: 'L\'utilisateur où vous souhaitez modifier son nom',
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
        },
        {
          name: 'surnom',
          description: 'le surnom du membre',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "ManageNicknames"
    },
    category: "Moderation",
    
    run: async (client, interaction, config, db) => {
        const targetUserId = interaction.options.get('utilisateur').value;
        const nicknameSubmission = interaction.options.get("surnom");
        const newNickname = nicknameSubmission?.value || null;

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
        {content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas renommer cet utilisateur car il a le même rôle/plus haut que vous.", ephemeral: true}
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply(
        {content: "<:ErrorIcon:1098685738268229754> Je ne peux pas renommer cet utilisateur car il a le même rôle/plus haut que moi.", ephemeral: true}
      );
      return;
    }

    const embed = new EmbedBuilder()
        .setAuthor({name: `Le surnom de ${targetUser.user.tag} a été changé en : ${newNickname}` , iconURL: `${targetUser.displayAvatarURL({size: 512, dynamic: true})}`})
        .setColor('278048');

    try {
      await targetUser.setNickname(newNickname);
      await interaction.reply({embeds: [embed]});
    } catch (error) {
      console.log(`<:ErrorIcon:1098685738268229754> Il y a eu une erreur lors du changement de pseudo : ${error}`);
    }
    },
};