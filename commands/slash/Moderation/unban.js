const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "unban",
  description: "🔨 | Débanni un membre banni.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description:
        "L'utilisateur que vous voulez débannir. (mettre une id)",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "BanMembers",
  },
  category: "Moderation",
  
  run: async (client, interaction, config, db) => {
    let targetUserId = interaction.options.get("utilisateur").value;
    const targetUser = await interaction.guild.members.fetch(targetUserId);
    if (!targetUserId)
      return message.reply({
        content: `<:ErrorIcon:1098685738268229754> L'utilisateur n'existe pas`,
        ephemeral: true,
      });

      try {
    await interaction.guild.members.unban(targetUserId);

    const unban = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.user.tag} a été débanni avec succès.`,
        iconURL: `${targetUser.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setColor("#278048");

    interaction.reply({ embeds: [unban] });
      } catch (error) {
        if(error.code === 10026) {
            return interaction.reply({
              content: `<:ErrorIcon:1098685738268229754> L'utilisateur ${targetUser.user.tag} n'est pas banni sur ce serveur.`,
              ephemeral: true
            });
          }
      }
  },
};
