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
      interaction.reply({content: mentionedUserId ? `<:ErrorIcon:1098685738268229754> ${targetUserObj.user.tag} n'a pas encore de niveaux. Réessayez lorsqu'ils discutent un peu plus.`
          : "<:ErrorIcon:1098685738268229754> Vous n'avez pas encore de niveaux. Discutez un peu plus et réessayez.", ephemeral: true
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

    const background = await loadImage(
      "https://cdn.discordapp.com/attachments/1055095464380338178/1106328249342103583/Sans_titre-1.png"
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // transparent font (gris)
    ctx.globalAlpha = 0.5 || 1;
    ctx.fillStyle = "#333640";
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

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
    ctx.fillText(`${targetUserObj.user.tag}`, 215 + 10, 125 - 40)

    if (badges.bitfield !== 0) {
      for (let i = 0; i < badge.length; i++) {
        if (badge[i] === "Staff") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631286635892847/9482-square-discord-staff.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "Partner") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631240603418736/1835-icon-partneredserverowner.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "CertifiedModerator") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631240880230461/6509-square-certified-moderator.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "Hypesquad") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631286124191824/7092-square-hypesquad.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse1") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631264179585024/3944-square-hypesquad-bravery.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse2") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631263885996062/3944-square-hypesquad-brilliance.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "HypeSquadOnlineHouse3") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631264561287248/9028-square-hypesquad-balance.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "BugHunterLevel2") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631286887555151/6222-square-bug-hunter-gold.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "BugHunterLevel1") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631286417784842/8676-square-bug-hunter.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "ActiveDeveloper") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631240360136825/1263-activedev-badge.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "VerifiedDeveloper") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631263588188231/7088-early-verified-bot-developer.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (badge[i] === "PremiumEarlySupporter") {
          const b = await loadImage(
            "https://cdn.discordapp.com/attachments/1055095464380338178/1106631241207398400/5053-early-supporter.png"
          );
          ctx.drawImage(b, 215 + 15 + i * 39, 95, 40, 40);
        }
        if (i === badge.length - 1) {
          if (targetUserObj && targetUserObj.premiumSinceTimestamp !== null) {
            if (
              (await interaction.guild.fetchOwner()).id === interaction.user.id
            ) {
              const b = await loadImage(
                Date.now() - targetUserObj.premiumSinceTimestamp >= 63115200000
                  ? "https://cdn.discordapp.com/attachments/1055095464380338178/1106947427853938688/1837-evolving-badge-nitro-24-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    47336400000
                  ? "https://media.discordapp.net/attachments/1055095464380338178/1106947428151742545/4340-evolving-badge-nitro-18-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    39447000000
                  ? "https://media.discordapp.net/attachments/1055095464380338178/1106947428483080323/5611-evolving-badge-nitro-15-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    31557600000
                  ? "https://media.discordapp.net/attachments/1055095464380338178/1106947408962785420/5974-evolving-badge-nitro-12.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    23668200000
                  ? "https://media.discordapp.net/attachments/1055095464380338178/1106947409264783480/8361-evolving-badge-nitro-9-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    15778800000
                  ? "https://media.discordapp.net/attachments/1055095464380338178/1106947409608712253/9625-evolving-badge-nitro-6-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    7889400000
                  ? "https://cdn.discordapp.com/attachments/1055095464380338178/1106947383675338862/5044-evolving-badge-nitro-3-months.png"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    5259600000
                  ? "https://cdn.discordapp.com/attachments/1055095464380338178/1106947383947956264/9625-evolving-badge-nitro-2-months.png"
                  : "https://cdn.discordapp.com/attachments/1055095464380338178/1106947384258347140/4390-evolving-badge-nitro-1-months.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 2) * 39, 95, 40, 40);
            } else {
              const b = await loadImage(
                Date.now() - targetUserObj.premiumSinceTimestamp >= 63115200000
                  ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    47336400000
                  ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    39447000000
                  ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    31557600000
                  ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    23668200000
                  ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    15778800000
                  ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    7889400000
                  ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96"
                  : Date.now() - targetUserObj.premiumSinceTimestamp >=
                    5259600000
                  ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96"
                  : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96"
              );
              ctx.drawImage(b, 215 + 15 + (i + 1) * 39, 95, 40, 40);
            }
          }
          if (
            interaction.user
              .displayAvatarURL({ dynamic: true })
              .endsWith(".gif") ||
            (targetUserObj
              ? targetUserObj.presence
                ? targetUserObj.presence.activities[0]
                  ? targetUserObj.presence.activities[0].emoji !== null
                    ? targetUserObj.presence.activities[0].emoji.id !==
                      undefined
                    : ""
                  : ""
                : ""
              : "") ||
            (targetUserObj
              ? targetUserObj.premiumSinceTimestamp !== null
              : "") ||
            (await this.bot.users.fetch(this.user.id, { force: true })).banner
          ) {
            if (
              (await interaction.guild.fetchOwner()).id ===
                targetUserObj.user.id &&
              targetUserObj &&
              targetUserObj.premiumSinceTimestamp !== null
            ) {
              const b = await loadImage(
                "https://cdn.discordapp.com/attachments/1055095464380338178/1106938373869928598/4306-subscriber-nitro.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 1) * 39, 95, 40, 40);
            } else if (
              (await interaction.guild.fetchOwner()).id ===
                targetUserObj.user.id &&
              targetUserObj &&
              targetUserObj.premiumSinceTimestamp === null
            ) {
              const b = await loadImage(
                "https://cdn.discordapp.com/attachments/1055095464380338178/1106938373869928598/4306-subscriber-nitro.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 1) * 39, 95, 40, 40);
            } else if (
              (await interaction.guild.fetchOwner()).id !==
                targetUserObj.user.id &&
              targetUserObj &&
              targetUserObj.premiumSinceTimestamp !== null
            ) {
              const b = await loadImage(
                "https://cdn.discordapp.com/attachments/1055095464380338178/1106938373869928598/4306-subscriber-nitro.png"
              );
              ctx.drawImage(b, 215 + 15 + (i + 1) * 39, 95, 40, 40);
            }
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
