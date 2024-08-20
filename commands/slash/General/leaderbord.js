const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Level = require("../../../models/levels");
const casinoSchema = require("../../../models/casino");
const ms = require("ms");
const { Canvas, loadImage, createCanvas, registerFont } = require("canvas");
const { resolve } = require("path");

registerFont(resolve("./models/fonts/Neon.ttf"), { family: "Neon" });

module.exports = {
  name: "leaderboard",
  description: "🥇 | Voir le classement XP ou Économie des membres du serveur.",
  type: 1,
  options: [
    {
      name: "type",
      description: "Choisissez entre XP ou Économie.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "XP", value: "xp" },
        { name: "Économie", value: "economy" }
      ]
    }
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",

  run: async (client, interaction) => {
    await interaction.deferReply();

    const leaderboardType = interaction.options.getString("type");

    let leaderboardEntries = [];
    let rank = 0;
    let title = "";
    let rankInfo = "";

    if (leaderboardType === "xp") {
      const canvas = createCanvas(867, 892);
      const ctx = canvas.getContext("2d");

      const allLevels = await Level.find({ guildId: interaction.guild.id }).exec();

      allLevels.sort((a, b) => b.level === a.level ? b.xp - a.xp : b.level - a.level);

      allLevels.forEach((level, i) => {
        level.rank = i + 1;
        level.save();
      });

      const targetUserId = interaction.member.id;
      const fetchedLevel = await Level.findOne({ userId: targetUserId, guildId: interaction.guild.id });
      rank = allLevels.findIndex(lvl => lvl.userId === targetUserId) + 1;

      leaderboardEntries = await Promise.all(
        allLevels.slice(0, 10).map(async (level, i) => {
          const user = await client.users.fetch(level.userId);
          const username = user ? user.username : "Utilisateur introuvable";
          return `${i + 1}. ${username} (Niveau ${level.level}, XP: ${level.xp})`;
        })
      );

      rankInfo = `${rank}. ${interaction.user.username} (Niveau: ${fetchedLevel.level} - XP: ${fetchedLevel.xp})`;
      title = "Classement XP des membres du serveur";

      const backgroundxp = await loadImage("./models/fonts/leaderboard.png");
      ctx.drawImage(backgroundxp, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#151515";
      ctx.fillRect(canvas.width / 4 + 175, 40, canvas.width - 393, canvas.height - 40);
      ctx.globalAlpha = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.font = "normal normal bold 30px Neon";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(leaderboardEntries.join("\n\n"), canvas.width / 2.2 + 25, 100);
      ctx.fillStyle = "#d5963f";
      ctx.fillText(rankInfo, canvas.width / 2.2 + 25, 800);
      const attachment = canvas.toBuffer();

      await interaction.editReply({ files: [{ attachment, name: "leaderboard.png" }] });

    } else if (leaderboardType === "economy") {
      const getLeaderboardData = async () => {
        const allEconomy = await casinoSchema.find({ guildId: interaction.guild.id }).exec();
        allEconomy.sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));

        const targetUserId = interaction.member.id;
        const fetchedEconomy = await casinoSchema.findOne({ userId: targetUserId, guildId: interaction.guild.id });
        rank = allEconomy.findIndex(data => data.userId === targetUserId) + 1;

        leaderboardEntries = await Promise.all(
          allEconomy.map(async (data, i) => {
            const user = await client.users.fetch(data.userId);
            const username = user ? user.username : "Utilisateur introuvable";
            return `${i + 1}. \`${username}\` • ${(data.cash + data.bank).toLocaleString()} <:IconCasinoChips:1008768785869713551>`;
          })
        );

        rankInfo = `**${rank}.** \`${interaction.user.username}\` • ${(fetchedEconomy.cash + fetchedEconomy.bank).toLocaleString()} <:IconCasinoChips:1008768785869713551>`;
        title = "Classement Freakshop LS";
      };

      await getLeaderboardData();

      const createLeaderboardEmbeds = async (entries, rankInfo, title) => {
        const embeds = [];
        const chunkSize = 10;
        const pageCount = Math.ceil(entries.length / chunkSize);

        for (let i = 0; i < pageCount; i++) {
          const chunk = entries.slice(i * chunkSize, (i + 1) * chunkSize);
          const serverIconURL = interaction.guild.iconURL({ size: 512, dynamic: true }); // URL_DE_REMPLACEMENT est une URL d'image par défaut si l'icône du serveur est introuvable.

          const embed = new EmbedBuilder()
            .setAuthor({
              name: title,
              iconURL: serverIconURL
            })
            .setDescription(chunk.join("\n"))
            .setFooter({ text: `Page ${Math.floor(i / chunkSize) + 1} sur ${Math.ceil(entries.length / chunkSize)} - Votre classement : ${rank}` })
            .setColor("#5865f2");
          
          embeds.push(embed);
        }
        return embeds;
      };

      const embeds = await createLeaderboardEmbeds(leaderboardEntries, rankInfo, title);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Précédent')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Suivant')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(embeds.length === 1)
        );

      const message = await interaction.editReply({
        embeds: [embeds[0]],
        components: [row],
      });

      const filter = i => i.customId === 'previous' || i.customId === 'next';
      const collector = message.createMessageComponentCollector({ filter, time: ms('2m') });

      let pageIndex = 0;

      collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
          return i.reply({ content: 'Vous ne pouvez pas utiliser ces boutons.', ephemeral: true });
        }

        if (i.customId === 'next') {
          pageIndex++;
        } else if (i.customId === 'previous') {
          pageIndex--;
        }

        row.components[0].setDisabled(pageIndex === 0);
        row.components[1].setDisabled(pageIndex === embeds.length - 1);

        await i.update({
          embeds: [embeds[pageIndex]],
          components: [row],
        });
      });

      collector.on('end', collected => {
        row.components.forEach(button => button.setDisabled(true));
        message.edit({ components: [row] });
      });
    }
  }
};