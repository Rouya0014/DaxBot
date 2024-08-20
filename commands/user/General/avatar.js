const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Avatar",
  type: 2,
  run: async (client, interaction, config, db) => {
    const member = interaction.guild.members.cache.get(interaction.targetId);

    let avatar = member.displayAvatarURL({
      size: 1024,
      dynamic: true,
    });

    const embed = new EmbedBuilder()
      .setTitle(`Voici l'avatar de: ${member.user.username}.`)
      .setImage(avatar)
      .setColor("#5865f2");

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
