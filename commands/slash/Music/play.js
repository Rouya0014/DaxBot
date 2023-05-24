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
  description: "🎵| Jouer de la musique !",
  type: 1,
  options: [
    {
      name: "nom",
      description: "Titre de chanson ?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  category: "Musique",
  
  run: async (client, interaction, config) => {

    await interaction.deferReply().catch((err) => {});
    const string = interaction.options.getString("nom");
    let voiceChannel = interaction.member.voice.channel;
  
      if (!voiceChannel)
        return interaction.followUp({
          content: "<:ErrorIcon:1098685738268229754> Vous n'êtes pas sur un canal audio !", 
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
        .addFields({ name: "Temps", value: `${tracks.duration}`, inline: true })
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
        .setColor("5865f2")
        .setImage(
          `${
            tracks.thumbnail ||
            "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"
          }`
        );
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
