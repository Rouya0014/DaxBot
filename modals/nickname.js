const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "nickname",
  run: async (client, interaction) => {
    if (interaction.guild.ownerId === interaction.member.id) {
      interaction.reply({
        content:
          "<:ErrorIcon:1098685738268229754> Je ne peux pas changer le pseudo du propriétaire du serveur",
        ephemeral: true,
      });
    } else {
      try {
        const newNickname = interaction.fields.getTextInputValue("surnom");

        await interaction.member.setNickname(newNickname);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${interaction.member.user.tag}, votre nouveaux surnom est : ${newNickname}`,
            iconURL: `${interaction.member.displayAvatarURL({
              size: 512,
              dynamic: true,
            })}`,
          })
          .setColor("278048");

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors du changement de pseudo",
          ephemeral: true,
        });
      }
    }
  },
};
