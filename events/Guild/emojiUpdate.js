const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "emojiUpdate",
};

client.on("emojiUpdate", (oldEmoji, newEmoji) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("#f6a72d")
      .setAuthor({name: `Emojis du serveur mis à jour !`, iconURL: "https://cdn.discordapp.com/emojis/1089201236965871777.webp?size=44&quality=lossless"})
      .setThumbnail(oldEmoji.url)
      .addFields(
        {name: "Nom précédent :", value: `> \`\`\`${oldEmoji.name}\`\`\``, inline: true},
        {name: "Nouveau nom :", value: `> \`\`\`${newEmoji.name}\`\`\``, inline: true},
      )
      logChannel.send({embeds: [embed]})
  });