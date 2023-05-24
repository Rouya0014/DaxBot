const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "emojiDelete",
};

client.on("emojiDelete", (emoji) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("e94349")
      .setAuthor({name: `Emojis du serveur supprimé !`, iconURL: "https://cdn.discordapp.com/emojis/1089201231777513632.webp?size=44&quality=lossless"})
      .setThumbnail(emoji.url)
      .addFields(
        {name: "Emoji supprimé", value: `> \`\`\`${emoji.name}\`\`\``, inline: true},
      )
      logChannel.send({embeds: [embed]})
  });