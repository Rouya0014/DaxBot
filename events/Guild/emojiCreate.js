const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "emojiCreate",
};

client.on("emojiCreate", (emoji) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("43a662")
      .setAuthor({name: `Emojis du serveur ajoutés !`, iconURL: "https://cdn.discordapp.com/emojis/1089201254019911710.webp?size=44&quality=lossless"})
      .setThumbnail(emoji.url)
      .addFields(
        {name: "Emojis ajoutés", value: `> \`\`\`${emoji.name}\`\`\``, inline: true},
      )
      logChannel.send({embeds: [embed]})
  });
  