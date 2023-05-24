const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "👤 | Affiche l'avatar d'un membre.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "Le membre @membre",
      type: ApplicationCommandOptionType.Mentionable,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction, config, db) => {
    const targetUserId =
      interaction.options.get("utilisateur") || interaction.user;
    const member = await interaction.guild.members.fetch(targetUserId);

    let avatar = member.displayAvatarURL({
      size: 1024,
      dynamic: true,
    });

    const embed = new EmbedBuilder()
      .setTitle(`Voici l'avatar de: ${member.user.tag}`)
      .setImage(avatar)
      .setColor("5865f2");

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
