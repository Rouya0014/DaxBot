const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "channelDelete"
};

client.on('channelDelete', (channel) => {
    const logChannel = client.channels.cache.get('1008348408592990278');
    if (!logChannel) return;
  
    const embed = new EmbedBuilder()
    .setColor("e94349")
    .setTimestamp()

    if (channel.type == "0") {
      logChannel.send({embeds: [embed.setAuthor({name: `Le salon textuel ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID du salon : ${channel.id}`})]});
    }
    if (channel.type == "2") {
      logChannel.send({embeds: [embed.setAuthor({name: `Le salon vocal ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID du salon : ${channel.id}`})]});
    }
    if (channel.type == "5") {
      logChannel.send({embeds: [embed.setAuthor({name: `Le salon d'annonces ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID du salon : ${channel.id}`})]});
    }
    if (channel.type == "15") {
      logChannel.send({embeds: [embed.setAuthor({name: `Le forum ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID du salon : ${channel.id}`})]});
    }
    if (channel.type == "13") {
      logChannel.send({embeds: [embed.setAuthor({name: `Le salon de conférence ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID du salon : ${channel.id}`})]});
    }
    if (channel.type == '4') {
      logChannel.send({embeds: [embed.setAuthor({name: `La catégorie ${channel.name} a été supprimée.`, iconURL: 'https://cdn.discordapp.com/emojis/1102984470606389329.webp?size=44&quality=lossless'}).setFooter({text: `ID de la catégorie : ${channel.id}`})]});
    }
  });