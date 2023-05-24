const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "stickerCreate",
};

client.on("stickerCreate", (sticker) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

    const description = sticker.description.toLowerCase();

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("43a662")
      .setAuthor({name: `Autocollants du serveur ajoutés !`, iconURL: "https://cdn.discordapp.com/emojis/1088933181786423416.webp?size=44&quality=lossless"})
      .setThumbnail(sticker.url)
      .addFields(
        {name: "Autocollant ajoutés", value: `> \`\`\`${sticker.name}\`\`\``},

      )
      if (description) {
        embed.addFields(
        {name: "Descripion", value: `> \`\`\`${description}\`\`\``},
      )
      }
      logChannel.send({embeds: [embed]})
  });
  