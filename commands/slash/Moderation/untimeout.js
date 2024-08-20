const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "untimeout",
  description: "🔨 | Stopper l'exclusion d'un membre.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur pour lequel vous souhaitez arrêter l'exclusion.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "MuteMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
    const mentionable = interaction.options.get("utilisateur").value;

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.",
        ephemeral: true,
      });
      return;
    }
    
    if (!targetUser.isCommunicationDisabled()) {
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> L'utilisateur **${targetUser.user.username}** n'est pas exclu.`,
        ephemeral: true,
      });
    } else {
      await targetUser.timeout(null);
      
      const untimeout = new EmbedBuilder()
        .setAuthor({
          name: `${targetUser.user.username} n'est plus exclu`,
          iconURL: `${targetUser.user.displayAvatarURL({ size: 512, dynamic: true })}`,
        })
        .setColor("#278048");

      await interaction.reply({
        embeds: [untimeout],
      });
    }
  },
};