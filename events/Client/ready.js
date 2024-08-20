const { EmbedBuilder,  ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const client = require("../../index");
const { bold } = require("chalk");
const { default: mongoose } = require("mongoose");
const config = require("../../config.json");
mongoose.set("strictQuery", false);
const db = require("croxydb")
const axios = require('axios');
const cheerio = require('cheerio');

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

  // ----------------- Rockstar Newswire
   const Newswire = require('../../models/Newswire');
   const url = `https://graph.rockstargames.com/?origin=https://www.rockstargames.com&operationName=NewswireList&variables=%7B"locale"%3A"fr_fr"%2C"tagId"%3A0%2C"page"%3A1%2C"metaUrl"%3A"%2Fnewswire"%7D&extensions=%7B"persistedQuery"%3A%7B"version"%3A1%2C"sha256Hash"%3A"eeb9e750157d583439e4858417291d5b09c07d7d48986858376a7a5a5d2f8a82"%7D%7D`;

   async function fetchImageFromURL(url) {
     try {
       const response = await axios.get(url);
       const $ = cheerio.load(response.data);
       const image = $('meta[property="og:image"]').attr('content');
       return image || 'https://via.placeholder.com/500';
     } catch (error) {
       console.error('Erreur lors de la récupération de l\'image :', error);
       return 'https://via.placeholder.com/500';
     }
   }
   
   function getNextThursday() {
     const now = new Date();
     const dayOfWeek = now.getDay();
     const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
     const nextThursday = new Date(now);
     nextThursday.setDate(now.getDate() + daysUntilThursday);
     nextThursday.setHours(11, 0, 0, 0);
     return nextThursday;
   }
   
   function getNextMonthTuesday() {
     const now = new Date();
     const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
     const dayOfWeek = firstDayOfNextMonth.getDay();
     const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
     const nextTuesday = new Date(firstDayOfNextMonth);
     nextTuesday.setDate(firstDayOfNextMonth.getDate() + daysUntilTuesday);
     nextTuesday.setHours(11, 0, 0, 0); // Set end time to 11 AM
     return nextTuesday;
   }
   
   async function fetchNewsData() {
     try {
       const response = await axios.get(url);
       return response.data.data.posts.results || [];
     } catch (error) {
       console.error('Erreur lors de la récupération des données des nouvelles :', error);
       return [];
     }
   }
   
   async function fetchAndUpdateNews() {
     try {
       const newsData = await fetchNewsData();
       
       if (newsData.length === 0) {
         console.log('Aucune nouvelle trouvée.');
         return;
       }
   
       // Filter GTA Online articles and sort by date
       const gtaOnlineArticles = newsData
         .filter(article => article.primary_tags.some(tag => tag.name === 'GTA Online'))
         .sort((a, b) => new Date(b.created.split(' ')[0].split('/').reverse().join('-') + 'T' + b.created.split(' ')[1] + ':00Z') - new Date(a.created.split(' ')[0].split('/').reverse().join('-') + 'T' + a.created.split(' ')[1] + ':00Z'));
   
       if (gtaOnlineArticles.length === 0) {
         console.log('Aucun article GTA Online trouvé.');
         return;
       }
   
       // Process the most recent GTA Online article
       const article = gtaOnlineArticles[0];
       const existingPost = await Newswire.findOne({ id: article.id });
       const channel = client.channels.cache.get('1008110383329988669');
   
       if (!channel) {
         console.error('Channel non trouvé.');
         return;
       }
   
       const now = new Date();
       const eventStartTime = new Date(now.getTime() + 10 * 1000).toISOString();
   
       let eventEndTime;
       const title = article.title.toLowerCase();
       if (title.includes('gta+')) {
         const nextMonthTuesday = getNextMonthTuesday();
         eventEndTime = nextMonthTuesday.toISOString();
       } else {
         const nextThursday = getNextThursday();
         eventEndTime = nextThursday.toISOString();
       }
   
       const postURL = `https://www.rockstargames.com/fr${article.url}`;
       const imageURL = await fetchImageFromURL(postURL);
   
       if (!existingPost) {
         const postDate = new Date(article.created.split(' ')[0].split('/').reverse().join('-') + 'T' + article.created.split(' ')[1] + ':00Z');
   
         const newPost = new Newswire({
           id: article.id,
           title: article.title,
           content: '', // No content
           date: postDate,
           locale: article.locale || 'fr_fr'
         });
         await newPost.save();
   
         // Create an embed
         const embed = new EmbedBuilder()
           .setColor('#ffab00')
           .setTitle(article.title)
           .setURL(postURL)
           .setImage(imageURL)
           .setTimestamp(postDate)
           .setFooter({ text: 'Rockstar Games' });
   
         // Create a button
         const button = new ButtonBuilder()
           .setLabel('Lire l\'article')
           .setStyle(ButtonStyle.Link)
           .setURL(postURL);
   
         const actionRow = new ActionRowBuilder().addComponents(button);
   
         await channel.send({
           embeds: [embed],
           components: [actionRow]
         });
   
         const eventData = {
           name: article.title,
           description: `Lien : ${postURL}`,
           scheduledStartTime: eventStartTime,
           scheduledEndTime: eventEndTime,
           privacyLevel: 2,
           entityType: 3,
           entityMetadata: {
             location: "Rockstar Newswire",
           },
           reason: "Création d'un événement via commande",
           image: imageURL
         };
         await channel.guild.scheduledEvents.create(eventData);
       }
     } catch (error) {
       console.error('Erreur lors de la récupération ou de la mise à jour des nouvelles :', error);
     }
   }
   
   await fetchAndUpdateNews();
   setInterval(fetchAndUpdateNews, 10 * 60 * 1000);

// ----------------- status rockstar

const fetchRockstarStatus = require('../../models/statutR');

function formatStatus(status, platformName) {
    return status
        .replace('UP', `<:OnlineStatusIcon:1101615234097090560> ${platformName}`)
        .replace("LIMITED", `<:IdleStatusIcon:1101615242712186890> ${platformName}`)
        .replace("DOWN", `<:DndStatusIcon:1101615251868373006> ${platformName}`);
}

function determineMaintenance(statuses) {
    const allStatuses = [
        statuses.gtao.pc,
        statuses.gtao.ps4,
        statuses.gtao.xboxOne,
        statuses.gtao.ps5,
        statuses.gtao.xboxSerie,
        statuses.socialClub.all,
        statuses.launcher.authentication,
        statuses.launcher.store,
        statuses.launcher.cloud,
        statuses.launcher.downloads
    ];

    // Vérifiez si tous les services sont en maintenance
    const allDown = allStatuses.every(status => status === 'DOWN');
    return allDown ? 'Tous les services sont actuellement en maintenance.' : null;
}

async function fetchAndFormatStatuses() {
    const response = await fetchRockstarStatus();
    const statuses = response;

    if (!statuses) {
        throw new Error('Erreur lors de la récupération des statuts');
    }

    // Formattage des statuts
    const gtaopc = formatStatus(statuses.gtao.pc, 'PC');
    const gtaops4 = formatStatus(statuses.gtao.ps4, 'PS4');
    const gtaoone = formatStatus(statuses.gtao.xboxOne, 'Xbox One');
    const gtaops5 = formatStatus(statuses.gtao.ps5, 'PS5');
    const gtaoserie = formatStatus(statuses.gtao.xboxSerie, 'Xbox Series X/S');

    const socialClub = formatStatus(statuses.socialClub.all, 'Toutes les fonctionnalités');

    const authentification = formatStatus(statuses.launcher.authentication, 'Authentification');
    const store = formatStatus(statuses.launcher.store, 'Store');
    const cloud = formatStatus(statuses.launcher.cloud, 'Cloud');
    const downloads = formatStatus(statuses.launcher.downloads, 'Downloads');

    const now = new Date();
    const nextUpdate = new Date(now.getTime() + 10 * 60 * 1000);

    const maintenanceMessage = determineMaintenance(statuses);

    return {
        gtao: `${gtaopc}\n${gtaops5}\n${gtaoserie}\n${gtaops4}\n${gtaoone}`,
        socialClub,
        launcher: `${authentification}\n${store}\n${cloud}\n${downloads}`,
        lastUpdate: now.toLocaleTimeString(),
        nextUpdate: nextUpdate.toLocaleTimeString(),
        maintenanceMessage
    };
}

async function sendStatusEmbed() {
    const channelId = '1024410723159392266';
    const channel = await client.channels.fetch(channelId);

    const status = await fetchAndFormatStatuses();

    const postUrl = 'https://support.rockstargames.com/fr/servicestatus';

    const embed = new EmbedBuilder()
        .setTitle('État des services Rockstar Games')
        .setURL(postUrl)
        .addFields(
            { name: "Grand Theft Auto Online", value: status.gtao, inline: true },
            { name: "Rockstar Games Launcher", value: status.launcher, inline: true },
            { name: "Social Club", value: status.socialClub, inline: true }
        )
        .setColor('#ffab00')
        .setFooter({ text: `Dernière actualisation à ${status.lastUpdate} | Prochaine actualisation à ${status.nextUpdate}` });

    const codecoul = new EmbedBuilder()
        .setDescription(status.maintenanceMessage || `<:OnlineStatusIcon:1101615234097090560> Actif • <:IdleStatusIcon:1101615242712186890> Limité • <:DndStatusIcon:1101615251868373006> Inactif`)
        .setColor("#303136");

    const button = new ButtonBuilder()
        .setLabel('Consulter le statut des services')
        .setStyle(ButtonStyle.Link)
        .setURL(postUrl);

    const actionRow = new ActionRowBuilder().addComponents(button);

    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();

    if (!lastMessage || !lastMessage.author.bot) {
        await channel.send({ embeds: [embed, codecoul], components: [actionRow] });
    } else {
        await lastMessage.edit({ embeds: [embed, codecoul], components: [actionRow], content: '\u200b' });
    }
}

await sendStatusEmbed();
setInterval(sendStatusEmbed, 10 * 60 * 1000);

// ----------------- Twitter
const puppeteer = require('puppeteer');

const TWITTER_PROFILE_URL = 'https://twitter.com/RockstarGames';
const CHANNEL_ID = '1008110383329988669'; 
const Tweet = require('../../models/TweetPost')

async function getTweets() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(TWITTER_PROFILE_URL, { waitUntil: 'networkidle2' });

  await page.waitForSelector('article');

  const tweetData = await page.evaluate(() => {
      const tweets = Array.from(document.querySelectorAll('article'));
      if (tweets.length < 2) return null;

      const getTweetDetails = (tweet) => {
          const tweetId = tweet.querySelector('a[href*="/status/"]')?.href.split('/').pop();
          const tweetText = tweet.querySelector('div[lang]')?.innerText || '';
          const tweetImage = tweet.querySelector('img[src*="media"]')?.src || null;
          return { tweetId, tweetText, tweetImage };
      };

      return {
          secondTweet: getTweetDetails(tweets[1]) // On se concentre sur le deuxième tweet
      };
  });

  await browser.close();
  return tweetData;
}

async function checkAndUpdateTweet() {
  const tweetData = await getTweets();
  if (!tweetData) {
      console.log('Tweets insuffisants ou erreur lors de la récupération.');
      return;
  }

  const { secondTweet } = tweetData;
  const { tweetId, tweetText, tweetImage } = secondTweet;

  if (!tweetId || !tweetText) {
      console.error('Informations du tweet manquantes :', secondTweet);
      return;
  }

  // Check if the tweet is already in the database
  const existingTweet = await Tweet.findOne({ tweetId });
  if (existingTweet) {
      return;
  }

  // Save new tweet to the database
  await Tweet.updateOne(
      { tweetId },
      { tweetId, content: tweetText, imageUrl: tweetImage },
      { upsert: true }
  );

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
      const embed = new EmbedBuilder()
          .setAuthor({ name: 'Rockstar Games sur 𝕏', iconURL: "https://pbs.twimg.com/profile_images/1417471791845478403/MzAWCfK7_400x400.jpg" })
          .setDescription(tweetText)
          .setColor('#1DA1F2');

          if (tweetImage) {
            embed.setImage(tweetImage)
          }

      const postUrl = `https://twitter.com/RockstarGames/status/${tweetId}`;

      const button = new ButtonBuilder()
          .setLabel('Voir le post')
          .setStyle(ButtonStyle.Link)
          .setURL(postUrl);

      const actionRow = new ActionRowBuilder().addComponents(button);

      try {
          await channel.send({ embeds: [embed], components: [actionRow] });
      } catch (error) {
          console.error('Erreur lors de l\'envoi du message Discord :', error);
      }
  } else {
      console.error('Le salon Discord spécifié est introuvable.');
  }
}

setInterval(checkAndUpdateTweet, 10 * 60 * 1000);

const Giveaway = require('../../models/giveaway');

        // Fonction pour terminer un giveaway
        const endGiveaway = async (giveaway) => {
          // Définir la variable winners ici
          let winnerMentions;
          let winners = [];
          
          if (giveaway.participants.length === 0) {
              winnerMentions = 'Personne n\'a participé au giveaway.';
          } else {
              winners = giveaway.participants.sort(() => Math.random() - 0.5).slice(0, giveaway.winners);
              winnerMentions = winners.map(w => `<@${w}>`).join(', ');
          }

          const finalEmbed = new EmbedBuilder()
              .setTitle(`🎉 ${giveaway.prize}`)
              .setDescription(`<:CompleteThePoll:1236289962815651841> Terminé le : <t:${Math.floor(Date.now() / 1000)}:F>`)
                  .addFields(
                      { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${giveaway.participants.length}`, inline: true },
                      { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${winners.length > 1 ? 'Gagnants' : 'Gagnant'}`, value: `${winnerMentions}`, inline: true },
                  )
              .setColor('Random')
              .setTimestamp();

          try {
              const giveawayChannel = client.channels.cache.get(giveaway.channelId);
              const giveawayMessage = await giveawayChannel.messages.fetch(giveaway.messageId);

              await giveawayMessage.edit({ embeds: [finalEmbed], components: [] });

              if (giveaway.participants.length > 0) {
                  await giveawayMessage.reply(`Félicitations à ${winnerMentions}! Vous avez gagné **${giveaway.prize}**!`);
              } else {
                  await giveawayMessage.reply(`Malheureusement, personne n'a participé au giveaway.`);
              }

              giveaway.ended = true;
              await giveaway.save();
          } catch (error) {
              console.error(`Erreur lors de la mise à jour du giveaway ${giveaway.messageId} après le redémarrage:`, error);
          }
      };

      // Récupérer les giveaways actifs et gérer leur état
      const activeGiveaways = await Giveaway.find({ ended: false });

      activeGiveaways.forEach(async (giveaway) => {
          const currentTime = Date.now();

          if (giveaway.paused) {
              return;
          }

          if (giveaway.endTime <= currentTime) {
              await endGiveaway(giveaway);
          } else {
              const timeLeft = giveaway.endTime - currentTime;

              setTimeout(async () => {
                  await endGiveaway(giveaway);
              }, timeLeft);
          }
      });
})