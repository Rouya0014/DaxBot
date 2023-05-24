const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "banner",
  description: "👤 | Affiche la bannière d'un membre.",
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

    let banner = await (
      await client.users.fetch(member.id, { force: true })
    ).bannerURL({ dynamic: true, size: 1024 });

    if (banner) {
      const embed = new EmbedBuilder()
        .setTitle(`Voici la bannière de: ${member.user.tag}`)
        .setImage(banner)
        .setColor("5865f2");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    return interaction.reply({
      content:
        "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas de bannière",
      ephemeral: true,
    });
  },
};
