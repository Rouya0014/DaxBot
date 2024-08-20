const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "nowplaying",
  description: "🎵 | Vous obtenez des informations sur la chanson en cours.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config, db) => {
    await interaction.deferReply().catch(err => {});
    
    const queue = client.distube.getQueue(interaction);
    if (!queue) 
      return interaction.followUp({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
    
    const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 20);
    
    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
      .addFields({ name: 'Artiste :', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true })
      .addFields({ name: 'Membre :', value: `${queue.songs[0].user}`, inline: true })
      .addFields({ name: 'Volume :', value: `${queue.volume}%`, inline: true })
      .addFields({ name: 'Vues :', value: `${queue.songs[0].views}`, inline: true })
      .addFields({ name: 'Likes :', value: `${queue.songs[0].likes}`, inline: true })
      .addFields({ name: 'Filtre :', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
      .addFields({ name: `Durée de la vidéo : **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`, value: ` ${'▬'.repeat(part) + '⚪' + '▬'.repeat(20 - part)}`, inline: false });
    
    return interaction.followUp({ embeds: [embed] }).catch(err => {});
  }
}