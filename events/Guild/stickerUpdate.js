const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "stickerUpdate",
};

client.on("stickerUpdate", (oldSticker, newSticker) => {
    const logChannel = client.channels.cache.get("1008348408592990278");
    if (!logChannel) return;

      const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor("f6a72d")
      .setAuthor({name: `Autocollants du serveur mis à jour !`, iconURL: "https://cdn.discordapp.com/emojis/1088933195715727571.webp?size=44&quality=lossless"})
      .setThumbnail(oldSticker.url)

      if (oldSticker.name !== newSticker.name) {
      embed.addFields(
        {name: "Nom précédent :", value: `> \`\`\`${oldSticker.name}\`\`\``, inline: true},
        {name: "Nouveau nom :", value: `> \`\`\`${newSticker.name}\`\`\``, inline: true},
        {name: '\u200b', value: '\u200b', inline: false},
      )
      }

      const descriptionHasChanged = oldSticker.description !== newSticker.description;
      if (descriptionHasChanged) {
        embed.addFields(
            {name: "Ancienne description :", value: `> \`\`\`${oldSticker.description}\`\`\``, inline: true},
            {name: "Nouvelle description :", value: `> \`\`\`${newSticker.description}\`\`\``, inline: true},
          )
      }
      logChannel.send({embeds: [embed]})
  });
  