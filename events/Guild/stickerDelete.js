const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "stickerDelete",
};

client.on("stickerDelete", (sticker) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("e94349")
      .setAuthor({name: `Autocollants du serveur supprimé !`, iconURL: "https://cdn.discordapp.com/emojis/1088933163784486912.webp?size=44&quality=lossless"})
      .setThumbnail(sticker.url)
      .addFields(
        {name: "Autocollant supprimé", value: `> \`\`\`${sticker.name}\`\`\``, inline: true},
      )
      logChannel.send({embeds: [embed]})
  });