const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType,
  ButtonStyle
} = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "play",
  description: "🎵 | Jouer de la musique !",
  type: 1,
  options: [
    {
      name: "nom",
      description: "Titre de la chanson ? | Lien youtube ou souncloud (fonctionne)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Musique",
  
  run: async (client, interaction, config) => {

    await interaction.deferReply().catch((err) => {});
    const string = interaction.options.getString("nom");
    let voiceChannel = interaction.member.voice.channel;
  
    if (!voiceChannel)
      return interaction.followUp({
        content: "<:ErrorIcon:1098685738268229754> Vous n'êtes pas dans un canal vocal !", 
        ephemeral: true
      });

    const queue = client.distube.getQueue(interaction);

    client.distube.voices.join(voiceChannel);

    await client.distube.play(interaction.member.voice.channel, string);
    const tracks = await client.player
      .search(string, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);

    if (!tracks) return interaction.followUp("🎵 | La musique a commencé.");
    
    const embed = new EmbedBuilder()
      .addFields({ name: "Titre", value: `${tracks.title}`, inline: true })
      .addFields({ name: "Auteur", value: `${tracks.author}`, inline: true })
      .addFields({ name: "Durée", value: `${tracks.duration}`, inline: true })
      .addFields({ name: "Vues", value: `${tracks.views}`, inline: true })
      .addFields({
        name: "Miniature",
        value: "[Cliquez](" + tracks.thumbnail + ")",
        inline: true,
      })
      .addFields({
        name: "Vidéo",
        value: "[Cliquez](" + tracks.url + ")",
        inline: true,
      })
      .setColor("#5865f2")
      .setImage(
        `${
          tracks.thumbnail ||
          "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"
        }`
      );
    
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("dur")
        .setEmoji("<:PauseIcon:1184957491528867942>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("volume")
        .setEmoji("<:ScreenShareVolumeIcon:1184958280188043335>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("skip")
        .setEmoji("<:SkipIcon:1266807444391067778>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("loop")
        .setEmoji("<:ReplayIcon:1184957488806760570>")
    );
    
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("soru")
        .setEmoji("<:HelpIcon:1184957471740141588>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("bassboost")
        .setEmoji("🥁"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("slowmode")
        .setEmoji("<:SlowModeIcon:1184957504665428058>"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("fast")
        .setEmoji("<:SpeedUpIcon:1266808818457641051>")
    );

    await interaction
      .followUp({ embeds: [embed], components: [row, row2] })
      .then((messages) => {
        db.set(`music_${interaction.guild.id}`, {
          kanal: interaction.channel.id,
          mesaj: messages.id,
          muzik: string,
          user: interaction.user.id,
          başlık: tracks.title,
          yükleyen: tracks.author,
          süre: tracks.duration,
          görüntülenme: tracks.views,
          thumb: tracks.thumbnail,
          video: tracks.url,
        });
      });

  },
};