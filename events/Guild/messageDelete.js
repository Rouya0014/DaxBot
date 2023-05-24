const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "messageDelete"
};

client.on('messageDelete', message => {
    const logChannel = client.channels.cache.get('1008348408592990278');
    if (!logChannel) return;

    if (message.author && message.author.id === client.user.id) return;
    
    if (message.author == undefined) {
      return;
    } else {
  
    const embed = new EmbedBuilder()
      .setColor('#e94349')
      .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL()})
      .setDescription(`**<:LogThreadMinusIcon:1088933178921717860> Le message de ${message.author} a été supprimé.**`)
      .setTimestamp()
      .addFields(
        { name: 'Salon', value: "> <#" + message.channel.id + ">", inline: true },
        { name: 'ID du salon', value: "> " + message.channel.id, inline: true },
        {name: '\u200b', value: '\u200b', inline: true},
        { name: 'ID du message', value: `> ${message.id}`, inline: true  },
        { name: 'ID de l\'auteur', value: `> ${message.author.id}`, inline: true },
        {name: '\u200b', value: '\u200b', inline: true},
        { name: 'Contenu', value: `\`\`\`${message.content}\`\`\``},
      );
  
    logChannel.send({ embeds: [embed] });
      }
  });