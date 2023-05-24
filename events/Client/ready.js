const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const { bold } = require("chalk");
const { default: mongoose } = require("mongoose");
const config = require("../../config.json");
mongoose.set("strictQuery", false);
const { google } = require("googleapis");
const youtubeSchema = require("../../models/youtube");
const db = require("croxydb")

module.exports = {
  name: "ready.js",
};

client.once("ready", async () => {
  await mongoose.connect(config.mongodb || "", {
    keepAlive: true,
  });

  if (mongoose.connect) {
    console.log(
      bold.red("[MongoDB] ") + bold.blueBright(`Logged into MongoDB`)
    );
  }
  console.log(
    bold.green("[Client] ") + bold.blue(`Logged into ${client.user.tag}`)
  );

  client.guilds.cache.filter(guild => {
    const data = db.fetch(`music_${guild.id}`)
    if (!data) return;
    db.delete(`music_${guild.id}`)
    })

  const youtube = google.youtube({
    version: "v3",
    auth: "AIzaSyBcW7rSXUbHnsSCQFH1oBm6GegRA4ZJOnY",
  });

  const channelId = "UCHYmtFLekfqyCbUHquT2s2g";

  const channel = client.channels.cache.get("1008110383329988669");

  if (!channel) {
    console.error("Le canal Discord n'a pas été trouvé !");
    return;
  }

  let lastVideoId = "";

  setInterval(async () => {
    const data = await youtubeSchema.findOne({ GuildID: "991357889535033364" });
  
    if (data) {
      lastVideoId = data.lastVideoId;
    }
  
    const searchResponse = await youtube.search.list({
      channelId: channelId,
      part: "snippet",
      order: "date",
      type: "video",
      maxResults: 1,
    });
  
    if (searchResponse.data.items.length > 0) {
      const videoId = searchResponse.data.items[0].id.videoId;
  
      if (lastVideoId !== videoId) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        channel.send(`<@&1008321703098724472>\n**Rockstar Games France vient de sortir une nouvelle vidéo !**\n${videoUrl}`);
        lastVideoId = videoId;
        await youtubeSchema.findOneAndUpdate({ GuildID: "991357889535033364" }, { lastVideoId: videoId }, { upsert: true });
      }
    }
  }, 10 * 60 * 1000);

  const fetchStatus = require(`../../models/statutR`)
  var statuschannel = client.channels.cache.get("1024410723159392266");

  statuschannel.messages.fetch({ limit: 1 }).then(message => {
    message.delete()
})

statuschannel.send('⏳ Les status arrive dans 2 minutes !').then((msg) => {
    setTimeout(() => {
        msg.edit('⏳ Les status arrive dans 1 minute et 30 secondes !')
        setTimeout(() => {
            msg.edit('⏳ Les status arrive dans 30 secondes !')
        }, 60000)
    }, 30000)
})

  setInterval(function() {

      fetchStatus().then((statuses) => {

          const gtaopc = statuses.gtao.pc
              .replace('UP', ' <:OnlineStatusIcon:1101615234097090560> PC')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> PC")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> PC")
          const gtaops4 = statuses.gtao.ps4
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> PS4')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> PS4")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> PS4")
          const gtaoone = statuses.gtao.xboxOne
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Xbox One')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Xbox One")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Xbox One")
          const gtaops5 = statuses.gtao.ps5
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> PS5')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> PS5")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> PS5")
          const gtaoserie = statuses.gtao.xboxSerie
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Xbox Series X/S')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Xbox Series X/S")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Xbox Series X/S")
          
          
          const socialClub = statuses.socialClub.all
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Toutes les fonctionnalités')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Toutes les fonctionnalités")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Toutes les fonctionnalités")
          
          const authentification = statuses.launcher.authentication
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Authentification')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Authentification")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Authentification")
          const store = statuses.launcher.store
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Store')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Store")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Store")
          const cloud = statuses.launcher.cloud
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Cloud')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Cloud")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Cloud")
          const downloads = statuses.launcher.downloads
              .replace('UP', '<:OnlineStatusIcon:1101615234097090560> Downloads')
              .replace("LIMITED", "<:IdleStatusIcon:1101615242712186890> Downloads")
              .replace("DOWN", "<:DndStatusIcon:1101615251868373006> Downloads")
      

      
      //Edits last message 
      statuschannel.messages.fetch({ limit: 1 }).then(messages => {
          var lastMessage = messages.first();
          if (!lastMessage.author.client) {
          console.log("last message's author is not a bot!")
          }
          var d = new Date;

          const embed = new EmbedBuilder()
              .setTitle("État des services Rockstar Games")
              //.setDescription(`${gtaopc}\n${gtaops5}\n${gtaoserie}\n${gtaops4}\n${gtaoone}`)
              .addFields(
                {name: "Grand Theft Auto Online", value: `${gtaopc}\n${gtaops5}\n${gtaoserie}\n${gtaops4}\n${gtaoone}`, inline: true},
                {name: "Rockstar Games Launcher", value: `${authentification}\n${store}\n${cloud}\n${downloads}`, inline: true},
                {name: "Social Club", value: `${socialClub}`, inline: true},
              )
              .setColor('ffab00')
              .setFooter({text: `Dernière actualisation :`})
              .setTimestamp()

          const codecoul = new EmbedBuilder()
              .setDescription(`<:OnlineStatusIcon:1101615234097090560> Actif • <:IdleStatusIcon:1101615242712186890> Limité • <:DndStatusIcon:1101615251868373006> Inactif`)
              .setColor("303136")



          lastMessage.edit({ embeds: [embed, codecoul], content: '\u200b'})
      })


      })

}, 10 * 60 * 1000);

});