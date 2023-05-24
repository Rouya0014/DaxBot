const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "untimeout",
  description: "🔨 | Stop l'exclusion d'un membre.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous souhaitez arrêter d'exclure.",
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
        content:
          "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.",
        ephemeral: true,
      });
      return;
    }
    if (!targetUser.timeout()) {
      return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> L'utilisateur **${targetUser.username}** n'est pas exclu.`,
        ephemeral: true,
      });
    }

    targetUser.timeout(null);
    const untimeout = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.user.tag} n'est plus exclu`,
        iconURL: `${targetUser.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setColor("#278048");

    interaction.reply({
      embeds: [untimeout],
    });
  },
};
