const {
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const calculateLevelXp = require("../../../models/utils/calculeteLevelXp");
const Level = require("../../../models/levels");
const { loadImage, createCanvas, registerFont } = require("canvas");
const { resolve } = require("path");

module.exports = {
  name: "rank",
  description: "👤 | Affiche votre niveau / celui de quelqu'un.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur dont vous voulez voir le niveau.",
      type: ApplicationCommandOptionType.Mentionable,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",

  run: async (client, interaction, config, db) => {
    registerFont(resolve("./models/fonts/Neon.ttf"), { family: "Neon" });

    const mentionedUserId = interaction.options.get("utilisateur")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.reply({
        content: mentionedUserId
          ? `<:ErrorIcon:1098685738268229754> ${targetUserObj.user.username} n'a pas encore de niveaux. Réessayez lorsqu'ils discutent un peu plus.`
          : "<:ErrorIcon:1098685738268229754> Vous n'avez pas encore de niveaux. Discutez un peu plus et réessayez.",
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();
    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const level = fetchedLevel.level,
      xp = fetchedLevel.xp,
      rank = currentRank,
      xpObjectif = calculateLevelXp(fetchedLevel.level);

    let xpBarre = Math.floor((xp / xpObjectif) * 490);
    const canvas = createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    const background = await loadImage("./models/fonts/rankcard.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // transparent font (gris)
    ctx.globalAlpha = 0.5 || 1;
    ctx.fillStyle = "#333640";
    ctx.beginPath();
    ctx.moveTo(40, 20); // Coin supérieur gauche
    ctx.quadraticCurveTo(20, 20, 20, 40); // Coin supérieur gauche arrondi
    ctx.lineTo(20, canvas.height - 40); // Bord gauche ajusté
    ctx.quadraticCurveTo(20, canvas.height - 20, 40, canvas.height - 20); // Coin inférieur gauche arrondi ajusté
    ctx.lineTo(canvas.width - 40, canvas.height - 20); // Bord inférieur ajusté
    ctx.quadraticCurveTo(
      canvas.width - 20,
      canvas.height - 20,
      canvas.width - 20,
      canvas.height - 40
    ); // Coin inférieur droit arrondi ajusté
    ctx.lineTo(canvas.width - 20, 40); // Bord droit ajusté
    ctx.quadraticCurveTo(canvas.width - 20, 20, canvas.width - 40, 20); // Coin supérieur droit arrondi ajusté
    ctx.lineTo(40, 20); // Bord supérieur ajusté
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 1;

    const badges = await targetUserObj.user.fetchFlags();
    const badge = badges
      .toArray()
      .filter(
        (b) =>
          b !== "BotHTTPInteractions" &&
          b !== "Quarantined" &&
          b !== "Spammer" &&
          b !== "TeamPseudoUser" &&
          b !== "VerifiedBot"
      );

    let statuscolor;
    if (targetUserObj.presence?.status === "online") {
      statuscolor = "#43B581";
    } else if (targetUserObj.presence?.status === "idle") {
      statuscolor = "#FAA61A";
    } else if (targetUserObj.presence?.status === "dnd") {
      statuscolor = "#F04747";
    } else if (targetUserObj.presence?.status === "offline") {
      statuscolor = "#747F8E";
    } else if (targetUserObj.presence?.status === "streaming") {
      statuscolor = "#593595";
    } else {
      statuscolor = "#747F8E";
    }
    ctx.save();
    ctx.translate(30, 0);
    // Rond Avatar
    ctx.beginPath();
    ctx.arc(115, 150, 80, 0, Math.PI * 2, true);
    ctx.strokeStyle = statuscolor;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.font = "35px Neon";
    ctx.fillStyle = "#fff";
    ctx.fillText(`${targetUserObj.user.username}`, 215 + 10, 125 - 40);

    if (badges.bitfield !== 0) {
      for (let i = 0; i < badge.length; i++) {
        if (badge[i] === "Staff") {
          const b = await loadImage("./models/fonts/badge/discord-staff.png");
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "Partner") {
          const b = await loadImage(
            "./models/fonts/badge/partnered-server-owner.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "CertifiedModerator") {
          const b = await loadImage(
            "./models/fonts/badge/moderator-programs-alumni.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "Hypesquad") {
          const b = await loadImage("./models/fonts/badge/hypesquad.png");
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse1") {
          const b = await loadImage(
            "./models/fonts/badge/hypesquad-bravery.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse2") {
          const b = await loadImage(
            "./models/fonts/badge/hypesquad-brilliance.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse3") {
          const b = await loadImage(
            "./models/fonts/badge/hypesquad-balance.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "BugHunterLevel2") {
          const b = await loadImage("./models/fonts/badge/gold-bug-hunter.png");
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "BugHunterLevel1") {
          const b = await loadImage("./models/fonts/badge/bug-hunter.png");
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "ActiveDeveloper") {
          const b = await loadImage(
            "./models/fonts/badge/active-developer-badge.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "VerifiedDeveloper") {
          const b = await loadImage(
            "./models/fonts/badge/early-verified-bot-developer.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "PremiumEarlySupporter") {
          const b = await loadImage("./models/fonts/badge/early-supporter.png");
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (i === badge.length - 1) {
          if (targetUserObj && targetUserObj.premiumSinceTimestamp !== null) {
            if (
              (await interaction.guild.fetchOwner()).id === interaction.user.id
            ) {
              const b = await loadImage(
                Date.now() - targetUserObj.premiumSinceTimestamp >= 63115200000
                  ? "./models/fonts/badge/badge-nitro-24-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    47336400000
                  ? "./models/fonts/badge/badge-nitro-18-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    39447000000
                  ? "./models/fonts/badge/badge-nitro-15-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    31557600000
                  ? "./models/fonts/badge/badge-nitro-12.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    23668200000
                  ? "./models/fonts/badge/badge-nitro-9-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    15778800000
                  ? "./models/fonts/badge/badge-nitro-6-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    7889400000
                  ? "./models/fonts/badge/badge-nitro-3-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    5259600000
                  ? "./models/fonts/badge/badge-nitro-2-months.png"
                  : "./models/fonts/badge/badge-nitro-1-months.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 2) * 39, 95, 40, 40);
            } else {
              const b = await loadImage(
                Date.now() - targetUserObj.premiumSinceTimestamp >= 63115200000
                  ? "./models/fonts/badge/badge-nitro-24-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    47336400000
                  ? "./models/fonts/badge/badge-nitro-18-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    39447000000
                  ? "./models/fonts/badge/badge-nitro-15-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    31557600000
                  ? "./models/fonts/badge/badge-nitro-12.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    23668200000
                  ? "./models/fonts/badge/badge-nitro-9-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    15778800000
                  ? "./models/fonts/badge/badge-nitro-6-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    7889400000
                  ? "./models/fonts/badge/badge-nitro-3-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    5259600000
                  ? "./models/fonts/badge/badge-nitro-2-months.png"
                  : "./models/fonts/badge/badge-nitro-1-months.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 1) * 39, 95, 40, 40);
            }
          }
          const isUserOwner =
            (await interaction.guild.fetchOwner()).id === targetUserObj.user.id;
          const hasNitro = targetUserObj.premiumSinceTimestamp !== null;
          const hasGifAvatar = targetUserObj.user.avatar?.startsWith("a_");
          const hasBanner = await (
            await client.users.fetch(targetUserObj.id, { force: true })
          ).bannerURL();

          if (hasGifAvatar || hasNitro || hasBanner) {
            const badgePath = "./models/fonts/badge/subscriber-nitro.png";

            // Déterminer l'index où placer le badge
            const badgeIndex = 215 + 15 + (i + 1) * 39;

            const badgeImage = await loadImage(badgePath);
            ctx.drawImage(badgeImage, badgeIndex, 95, 40, 40);
          }
        }
      }
    }
    ctx.font = "20px Neon";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Level : ${level}`, 215 + 30, 190);

    ctx.font = "20px Neon";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Rank : ${rank}`, 325 + 30, 190);
    ctx.save();
    ctx.translate(30, 0);
    // Barre blanche
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.fillStyle = "#484b4e";
    ctx.moveTo(200, 152.5);
    ctx.quadraticCurveTo(/*Abstraction*/ 200, 135, /*Arivée */ 220, 135);
    ctx.lineTo(690, 135);
    ctx.quadraticCurveTo(/*Abstraction*/ 710, 135, /*Arivée */ 710, 152.5);
    ctx.quadraticCurveTo(/*Abstraction*/ 710, 170, /*Arivée */ 690, 170);
    ctx.lineTo(220, 170);
    ctx.quadraticCurveTo(/*Abstraction*/ 200, 170, /*Arivée */ 200, 152.5);
    ctx.fill();
    ctx.closePath();

    // Barre rouge
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.fillStyle = "#586bec";
    ctx.moveTo(200, 152.5);
    ctx.quadraticCurveTo(/*Abstraction*/ 200, 135, /*Arivée */ 220, 135);
    ctx.lineTo(220 + xpBarre - 20, 135);
    ctx.quadraticCurveTo(
      /*Abstraction*/ 220 + xpBarre,
      135,
      /*Arivée */ 220 + xpBarre,
      152.5
    );
    ctx.quadraticCurveTo(
      /*Abstraction*/ 220 + xpBarre,
      170,
      /*Arivée */ 220 + xpBarre - 20,
      170
    );
    ctx.lineTo(220, 170);
    ctx.quadraticCurveTo(/*Abstraction*/ 200, 170, /*Arivée */ 200, 152.5);
    ctx.fill();
    ctx.font = "28px Neon";
    ctx.fillStyle = "#fff";
    ctx.fillText(`${xp} / ${xpObjectif} XP`, 450, 162);
    ctx.closePath();
    ctx.restore();

    //Arc
    ctx.beginPath();
    ctx.arc(115, 150, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(
      targetUserObj.user.displayAvatarURL({ size: 256, extension: "png" })
    );
    ctx.drawImage(avatar, 25, 60, 180, 180);
    ctx.globalAlpha = 1;
    ctx.restore();

    const attachment = new AttachmentBuilder(canvas.toBuffer(), `rankcard.png`);
    interaction.editReply({ files: [attachment] });
  },
};
