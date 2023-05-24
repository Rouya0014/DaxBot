const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "messageUpdate"
};

client.on('messageUpdate', (oldMessage, newMessage) => {
    const logChannel = client.channels.cache.get('1008348408592990278');
    if (!logChannel) return;

    if (newMessage.pinned) return;
    if (newMessage.author.id === client.user.id) return;
    if (newMessage.author.bot) return;
  
    const embed = new EmbedBuilder()
      .setColor('#f6a72d')
      .setAuthor({name: newMessage.author.tag, iconURL: newMessage.author.avatarURL()})
      .setDescription(`**<:LogThreadUpdateIcon:1088933547634606214> ${newMessage.author} a modifié son message.**`)
      .setTimestamp()
      .addFields(
        { name: 'Salon', value: "> <#" + newMessage.channel.id + ">", inline: true },
        { name: 'ID du salon', value: "> " + newMessage.channel.id, inline: true },
        { name: 'ID du message', value: "> " + newMessage.id },
        { name: 'Ancien contenu', value: `\`\`\`${oldMessage.content} \`\`\``, inline: true },
        { name: 'Nouveau contenu', value: `\`\`\`${newMessage.content} \`\`\``, inline: true },
      );
  
    logChannel.send({ embeds: [embed] });
  });