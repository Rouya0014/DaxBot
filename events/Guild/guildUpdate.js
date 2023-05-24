const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "guildUpdate",
};

client.on("guildUpdate", (oldGuild, newGuild) => {
  const logChannel = client.channels.cache.get("1008348408592990278");
  if (!logChannel) return;

  const verificationLeveltext = {
    1: "Faible",
    2: "Moyen",
    3: "Élevé",
    4: "Maximum",
  };

  const embed = new EmbedBuilder()
    .setTimestamp()
    .setColor("f6a72d")
    .setThumbnail(newGuild.iconURL())
    .setAuthor({
      name: `Modification d'informations du serveur !`,
      iconURL:
        "https://cdn.discordapp.com/emojis/1088934701919649905.webp?size=44&quality=lossless",
    });

  if (oldGuild.bannerURL()) {
    embed.setImage(oldGuild.bannerURL());
  }
  if (oldGuild.name !== newGuild.name) {
    embed.addFields({
      name: "Ancien nom :",
      value: `> \`\`\`${oldGuild.name}\`\`\``,
      inline: true,
    },
    {
      name: "Nouveau nom :",
      value: `> \`\`\`${newGuild.name}\`\`\``,
      inline: true,
    },
    )
  }

  if (oldGuild.bannerURL() !== newGuild.bannerURL()) {
    embed.addFields({ name: "Bannière :", value: "> Bannière modifiée", inline: false })
      .setImage(newGuild.bannerURL());
  }

  if (oldGuild.splashURL() !== newGuild.splashURL()) {
    embed.addFields({ name: "Arrière-plan :", value: "> Arrière-plan modifié", inline: false});
  }

  
  const oldDescription = oldGuild.description || "Aucune";
  const newDescription = newGuild.description || "Aucune";
  if (oldGuild.description !== newGuild.description) {
    embed.addFields({
      name: "Ancienne description :",
      value: `> \`\`\`${oldDescription}\`\`\``,
      inline: true,
    },
    {
      name: "Nouvelle description :",
      value: `> \`\`\`${newDescription}\`\`\``,
      inline: true,
    },
    { name: "\u200b", value: "\u200b", inline: true })
  }
  if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
    embed.addFields(
      {
        name: "Ancien niveau de vérification :",
        value: `> \`\`\`${verificationLeveltext[oldGuild.verificationLevel]}\`\`\``,
        inline: true,
      },
      {
        name: "Nouveau niveau de vérification :",
        value: `> \`\`\`${verificationLeveltext[newGuild.verificationLevel]}\`\`\``,
        inline: true,
      },
      { name: "\u200b", value: "\u200b", inline: true }
    );
  }

  logChannel.send({ embeds: [embed] });
})
