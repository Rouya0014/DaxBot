const { EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  name: "bot-info",
  description: "👤 | Affiche les informations de Dax.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",

  run: async (client, interaction, config, db) => {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);

    let uptime = `${days} jours, ${hours} heures et ${minutes} minutes.`;

    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: `${client.user.displayAvatarURL({
          size: 512,
          dynamic: true,
        })}`,
      })
      .setColor("#5865f2")
      .addFields(
        {
          name: "<:InfoIcon:1184958196507496590> Informations globales du bot",
          value: `\`\`\`fix\nNom     : ${client.user.username}\nID      : ${client.user.id}\nMembres : ${interaction.guild.memberCount}\nPing    : ${ping} ms\nUptime  : ${uptime}\`\`\``,
          inline: false,
        },
        {
          name: "<:TheBestServerEmojisIcon:1184958401906753556> Contributeurs",
          value: `\`\`\`fix\nDéveloppeurs : @_rouya\n             : @zerkay\`\`\``,
          inline: false,
        },
        {
          name: "<:SettingsInfo:1249419981419057313> Informations avancées du bot",
          value: `\`\`\`fix\nDiscord      : discord.js@14.11.0\nNode         : v20.16.0\nRAM utilisée : ${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024).toFixed(
            2
          )} MB\`\`\``,
          inline: false,
        }
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
