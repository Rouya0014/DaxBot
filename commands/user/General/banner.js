const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Banner",
  type: 2,
  run: async (client, interaction, config, db) => {
    const member = interaction.guild.members.cache.get(interaction.targetId);

    let banner = await (await client.users.fetch(member.id, {force: true})).bannerURL({dynamic: true, size: 1024})
      
    if(banner) {
          const embed = new EmbedBuilder()
            .setTitle(`Voici la bannière de: ${member.user.username}`)
            .setImage(banner)
            .setColor("#5865f2");

    return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    return interaction.reply({content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas de bannière", ephemeral: true});
  },
};