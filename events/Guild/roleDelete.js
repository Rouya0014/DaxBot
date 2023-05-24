const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "roleDelete"
};


client.on('roleDelete', role => {
  const logChannel = client.channels.cache.get('1008348408592990278');
  if (logChannel) {
    const embed = new EmbedBuilder()
    .setAuthor({name: `Le rôle ${role.name} a été supprimé.`, iconURL: 'https://cdn.discordapp.com/emojis/1088933191546572832.webp?size=44&quality=lossless'})
    .setFooter({text: `ID du rôle : ${role.id}`})
    .setColor("e94349")
    .setTimestamp()
    
      logChannel.send({embeds: [embed]});
  
    }
});