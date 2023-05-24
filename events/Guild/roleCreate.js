const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "roleCreate"
};


client.on('roleCreate', role => {
    const logChannel = client.channels.cache.get('1008348408592990278');
    if (logChannel) {
      const embed = new EmbedBuilder()
      .setAuthor({name: `Le rôle ${role.name} a été créé.`, iconURL: 'https://cdn.discordapp.com/emojis/1088933176472256662.webp?size=44&quality=lossless'})
      .setFooter({text: `ID du rôle : ${role.id}`})
      .setColor("43a662")
      .setTimestamp()

        logChannel.send({embeds: [embed]});
    }
  });