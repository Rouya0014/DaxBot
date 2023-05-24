const {
  EmbedBuilder,
} = require("discord.js");
const Level = require("../../../models/levels");
const { Canvas, loadImage, createCanvas, registerFont } = require("canvas");
const { resolve } = require("path");

registerFont(resolve("./models/fonts/Neon.ttf"), { family: "Neon" });

module.exports = {
  name: "leaderboard",
  description:
    "🥇 | Voir le classement d'xp des membres du serveur.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction, config) => {
    await interaction.deferReply();

    const canvas = createCanvas(867, 892);
    const ctx = canvas.getContext("2d");

    const allLevels = await Level.find({
      guildId: interaction.guild.id,
    }).exec();
    allLevels.forEach((level, i) => {
      level.rank = i + 1;
      level.save();
    });

    const allLevelsRanked = await Level.find({
      guildId: interaction.guild.id,
    }).sort({ rank: "asc" });

    const targetUserId = interaction.member.id;

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const level = fetchedLevel.level,
      xp = fetchedLevel.xp,
      rank = currentRank;

    const leaderboardEntries = allLevelsRanked
      .slice(0, 10)
      .map(async (level, i) => {
        const user = await client.users.fetch(level.userId);
        const username = user ? user.tag : "Utilisateur introuvable";
        return `${(level.rank = i + 1)}. ${username} (Level ${level.level}, XP: ${level.xp})`;
      });

    const leaderboard = (await Promise.all(leaderboardEntries)).join("\n\n");

    const background = await loadImage(
      "https://media.discordapp.net/attachments/1055095464380338178/1109482564256804894/Sans_titre-3.png?width=682&height=702"
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.5 || 1;
    ctx.fillStyle = "#151515";
    ctx.fillRect(canvas.width / 4 + 55, 20, canvas.width - 293, canvas.height - 40);

    ctx.globalAlpha = 1;

    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = "normal normal bold 30px Neon";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${leaderboard}`, canvas.width / 3 + 25, 100);
    ctx.fillStyle = "#f81137";
    ctx.fillText(`${rank}. ${interaction.user.tag} (Level: ${level} - XP: ${xp})`, canvas.width / 3 + 25, 800);
    ctx.beginPath();
    ctx.closePath();
    ctx.clip();

    const attachment = canvas.toBuffer();
    const attachmentName = "leaderboard.png";
    interaction.editReply({ files: [attachment], name: attachmentName });
  },
};