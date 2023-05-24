const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js")
const db = require("croxydb")

module.exports = {
  name: "leave",
  description: "🎵 | Fini la musique !",
  type: 1,
  options: [],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {

    const embed = new EmbedBuilder()
    .setAuthor({name: `Je quitte le salon vocal.`})
    .setColor('5865f2')

      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.reply({content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`, ephemeral: true})
         client.distube.voices.leave(interaction)
         await interaction.reply({ embeds: [embed] });
         db.delete(`music_${interaction.guild.id}`)
return;
 }
}
