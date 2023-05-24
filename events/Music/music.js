const { ModalBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, TextInputBuilder, TextInputStyle, Discord, ButtonStyle} = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { Player } = require("discord-player");
const client = require("../../index");
const db = require("croxydb")

const player = new Player(client);

client.player = player;
client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnFinish: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

module.exports = {
    name: "interactionCreate"
}

client.on("interactionCreate", (interaction) => {
    if (interaction.customId === "fast") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      queue.filters.add("nightcore");
      const speedembed = new EmbedBuilder()
      .setAuthor({ name: `La chanson a été accélérée avec succès.` })
      .setColor("278048");
      interaction.reply({ embeds: [speedembed], ephemeral: true });
    }
    if (interaction.customId === "slowmode") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      queue.filters.add("vaporwave");
      const Slowmodeembed = new EmbedBuilder()
      .setAuthor({ name: `La chanson a été ralentie avec succès.` })
      .setColor("278048");
      interaction.reply({ embeds: [Slowmodeembed], ephemeral: true });
    }
    if (interaction.customId === "bassboost") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      queue.filters.add("bassboost");
      const bassembed = new EmbedBuilder()
    .setAuthor({name: `Les basses ont été boostée avec succès.`})
    .setColor('278048')
      interaction.reply({ embeds: [bassembed], ephemeral: true });
    }
    if (interaction.customId === "soru") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 20);
      const embed = new EmbedBuilder()
              .setColor('5865f2')
              .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
              .addFields({ name: 'Artiste:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true })
              .addFields({ name: 'Membre:', value: `${queue.songs[0].user}`, inline: true })
              .addFields({ name: 'Volume:', value: `${queue.volume}%`, inline: true })
              .addFields({ name: 'Vues:', value: `${queue.songs[0].views}`, inline: true })
              .addFields({ name: 'Like:', value: `${queue.songs[0].likes}`, inline: true })
              .addFields({ name: 'Filtre:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
              .addFields({ name: `Durée de la vidéo : **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`, value: ` ${'▬'.repeat(part) + '⚪' + '▬'.repeat(20 - part)}`, inline: false })
      return interaction
        .reply({ embeds: [embed], ephemeral: true })
        .catch((err) => {});
    }
    if (interaction.customId === "dur") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      let usır = data.user;
      let string = data.string;
      if (interaction.user.id !== usır)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Seule la personne qui a écrit la commande peut utiliser ce bouton.",
          ephemeral: true,
        });
      const baslik = data.başlık;
      const author = data.yükleyen;
      const sure = data.süre;
      const izlenme = data.görüntülenme;
      const thumb = data.thumb;
      const url = data.video;
      const embed = new EmbedBuilder()
      .addFields({ name: "Titre", value: `${baslik}`, inline: true })
      .addFields({ name: "Auteur", value: `${author}`, inline: true })
      .addFields({ name: "Temps", value: `${sure}`, inline: true })
      .addFields({ name: "Vues", value: `${izlenme}`, inline: true })
      .addFields({
        name: "Miniature",
        value: "[Cliquez](" + thumb + ")",
        inline: true,
      })
      .addFields({ name: "Vidéo", value: "[Cliquez](" + url + ")", inline: true })
      .setColor("5865f2")
        .setImage(`${thumb}`);
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:PlayIcon:1100757469308923996>")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("devam")
      );
      client.distube.pause(interaction);
      return interaction.update({ embeds: [embed], components: [row] });
    }
    if (interaction.customId === "skip") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      if (queue.songs.length === 1)
        return interaction.reply({
          content: `<:ErrorIcon:1098685738268229754> Aucune chanson trouvée dans la file d'attente`,
          ephemeral: true,
        })
      let usır = data.user;
      let string = data.string;
      if (interaction.user.id !== usır)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Seule la personne qui a écrit la commande peut utiliser ce bouton.",
          ephemeral: true,
        });
      const baslik = data.başlık;
      const author = data.yükleyen;
      const sure = data.süre;
      const izlenme = data.görüntülenme;
      const thumb = data.thumb;
      const url = data.video;
      const embed = new EmbedBuilder()
        .addFields({ name: "Titre", value: `${baslik}`, inline: true })
        .addFields({ name: "Auteur", value: `${author}`, inline: true })
        .addFields({ name: "Temps", value: `${sure}`, inline: true })
        .addFields({ name: "Vues", value: `${izlenme}`, inline: true })
        .addFields({
          name: "Miniature",
          value: "[Cliquez](" + thumb + ")",
          inline: true,
        })
        .addFields({ name: "Vidéo", value: "[Cliquez](" + url + ")", inline: true })
        .setColor("5865f2")
        .setImage(`${thumb}`);
  
      client.distube.skip(interaction);
      return interaction.update({ embeds: [embed] });
    }
    if (interaction.customId === "loop") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      let usır = data.user;
      let string = data.string;
      if (interaction.user.id !== usır)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Seule la personne qui a écrit la commande peut utiliser ce bouton.",
          ephemeral: true,
        });
      const baslik = data.başlık;
      const author = data.yükleyen;
      const sure = data.süre;
      const izlenme = data.görüntülenme;
      const thumb = data.thumb;
      const url = data.video;
      const embed = new EmbedBuilder()
        .addFields({ name: "Titre", value: `${baslik}`, inline: true })
        .addFields({ name: "Auteur", value: `${author}`, inline: true })
        .addFields({ name: "Temps", value: `${sure}`, inline: true })
        .addFields({ name: "Vues", value: `${izlenme}`, inline: true })
        .addFields({
          name: "Miniature",
          value: "[Cliquez](" + thumb + ")",
          inline: true,
        })
        .addFields({ name: "Vidéo", value: "[Cliquez](" + url + ")", inline: true })
        .setColor("5865f2")
        .setImage(
          `${
            thumb ||
            "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"
          }`
        );
      client.distube.setRepeatMode(interaction, 1);
      return interaction.update({ embeds: [embed] });
    }
    if (interaction.customId === "devam") {
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.reply({
        content: `<:ErrorIcon:1098685738268229754> Il n'y a pas encore de chanson dans la liste.`,
        ephemeral: true,
      });
      let data = db.fetch(`music_${interaction.guild.id}`);
      if (!data)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Error **404**",
          ephemeral: true,
        });
      let usır = data.user;
      let string = data.string;
      if (interaction.user.id !== usır)
        return interaction.reply({
          content: "<:ErrorIcon:1098685738268229754> Seule la personne qui a écrit la commande peut utiliser ce bouton.",
          ephemeral: true,
        });
      const baslik = data.başlık;
      const author = data.yükleyen;
      const sure = data.süre;
      const izlenme = data.görüntülenme;
      const thumb = data.thumb;
      const url = data.video;
      const embed = new EmbedBuilder()
        .addFields({ name: "Titre", value: `${baslik}`, inline: true })
        .addFields({ name: "Auteur", value: `${author}`, inline: true })
        .addFields({ name: "Temps", value: `${sure}`, inline: true })
        .addFields({ name: "Vues", value: `${izlenme}`, inline: true })
        .addFields({
          name: "Miniature",
          value: "[Cliquez](" + thumb + ")",
          inline: true,
        })
        .addFields({ name: "Vidéo", value: "[Cliquez](" + url + ")", inline: true })
        .setColor("5865f2")
        .setImage(`${thumb}`);
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:PauseIcon:1100757461192937492>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("dur"),
        new ButtonBuilder()
          .setEmoji("<:VolumeIcon:1100760795522015334>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("volume"),
        new ButtonBuilder()
          .setEmoji("<:SkipIcon:1100757452795936820>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("skip"),
        new ButtonBuilder()
          .setEmoji("<:BoucleIcon:1100757483049463839>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("loop"),
      );
      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setEmoji("<:MusicIcon:1088231735348703342>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("soru"),
        new ButtonBuilder()
          .setEmoji("🥁")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("bassboost"),
        new ButtonBuilder()
          .setEmoji("<:RewindIcon:1100763652635754596>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("slowmode"),
        new ButtonBuilder()
          .setEmoji("<:FastForwardIcon:1100763640010907738>")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("fast"),
      );
      client.distube.resume(interaction);
      interaction.update({ embeds: [embed], components: [row, row2] });
    }
  });
  
  const modal = new ModalBuilder()
    .setCustomId("form")
    .setTitle("MoonBot");
  const a1 = new TextInputBuilder()
    .setCustomId("setvolume")
    .setLabel("Volume")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(1)
    .setPlaceholder("1 - 100")
    .setRequired(true);
  
  const row = new ActionRowBuilder().addComponents(a1);
  modal.addComponents(row);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "volume") {
      await interaction.showModal(modal);
    }
  });