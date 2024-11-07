const { EmbedBuilder,  ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const client = require("../../index");
const { bold, } = require("chalk");
const { default: mongoose } = require("mongoose");
const config = require("../../config.json");
mongoose.set("strictQuery", false);
const db = require("croxydb")
const axios = require('axios');
const cheerio = require('cheerio');
const franc = require('franc-min');


module.exports = {
  name: "ready.js",
};

client.once("ready", async () => {

  await mongoose.connect(config.mongodb || "", {
    keepAlive: true,
  });

  if (mongoose.connect) {
    console.log(
      bold.red("[MongoDB] ") + bold.blueBright(`Connecté à MongoDB`)
    );
  }
  console.log(
    bold.green("[Client] ") + bold.blue(`Connecté en tant que ${client.user.tag}`)
  );

  client.guilds.cache.filter(guild => {
    const data = db.fetch(`music_${guild.id}`)
    if (!data) return;
    db.delete(`music_${guild.id}`)
    })

  // ----------------- Rockstar Newswire
  const Newswire = require('../../models/newswire');

  const listUrl = `https://graph.rockstargames.com/?origin=https://www.rockstargames.com&operationName=NewswireList&variables=%7B"locale"%3A"fr_fr"%2C"tagId"%3A0%2C"page"%3A1%2C"metaUrl"%3A"%2Fnewswire"%7D&extensions=%7B"persistedQuery"%3A%7B"version"%3A1%2C"sha256Hash"%3A"eeb9e750157d583439e4858417291d5b09c07d7d48986858376a7a5a5d2f8a82"%7D%7D`;

  async function fetchLatestArticleUrl() {
    try {
      const response = await axios.get(listUrl);
      const posts = response.data?.data?.posts?.results || [];
  
      if (posts.length > 0) {
        let latestPost = posts[0];
  
        // Vérifier que "primary_tags" contient "GTA Online"
        if (latestPost.primary_tags && latestPost.primary_tags.some(tag => tag.name === 'GTA Online')) {
          // Vérifier si le titre contient "GTA+"
          if (latestPost.title.includes('GTA+' || "CircoLoco Records")) {
            // Prendre l'article précédent s'il existe
            latestPost = posts[1] || latestPost; // Utiliser le dernier article si aucun autre article n'est disponible
          }
          
          // Récupérer l'URL de l'article
          const articleUrl = latestPost.url; // Assurez-vous que `latestPost.url` est bien défini dans votre réponse
         
          // Construire l'URL de détail pour le dernier article valide
          const detailUrl = `https://graph.rockstargames.com/?origin=https://www.rockstargames.com&operationName=NewswirePost&variables=%7B"locale"%3A"fr_fr"%2C"id_hash"%3A"${latestPost.id}"%7D&extensions=%7B"persistedQuery"%3A%7B"version"%3A1%2C"sha256Hash"%3A"555658813abe5acc8010de1a1feddd6fd8fddffbdc35d3723d4dc0fe4ded6810"%7D%7D`;
          
 
          return { detailUrl, articleUrl }; // Retourner à la fois l'URL de détail et l'URL de l'article
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles :', error);
      return null;
    }
  }
  
  async function fetchNewsData(detailUrl) {
    try {
      const response = await axios.get(detailUrl);
      const data = response.data.data.post || {};
  
      let imageURL = 'https://via.placeholder.com/500';
      if (data.tina && data.tina.payload && data.tina.payload.meta && data.tina.payload.meta.preview_images && data.tina.payload.meta.preview_images.en_us) {
        const previewImages = data.tina.payload.meta.preview_images.en_us;
        const imagePath = previewImages['newswire-block-16x9'];
        if (imagePath) {
          imageURL = `https://media-rockstargames-com.akamaized.net${imagePath}`;
        }
      }
      const blurb = data.tina?.variables?.keys?.meta?.blurb || data.tina?.payload?.meta?.blurb || '';
  
      return { ...data, imageURL, blurb };
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'article :', error);
      return {};
    }
  }
  
  function getNextThursday() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
    let nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + daysUntilThursday);
    if (daysUntilThursday === 0 && now >= nextThursday) {
      nextThursday.setDate(nextThursday.getDate() + 7);
    }
    nextThursday.setHours(11, 0, 0, 0);
    return nextThursday;
  }
  
  async function fetchAndUpdateNews() {
    try {
      const result = await fetchLatestArticleUrl();
      if (!result) {

        return;
      }
  
      const { detailUrl, articleUrl } = result;
  
      const article = await fetchNewsData(detailUrl);
      if (!article || !article.id) {
        console.log("pas de résultat1")
        return;
      }
  
      const lastSavedArticle = await Newswire.findOne().sort({ date: -1 });
      if (lastSavedArticle && lastSavedArticle.id !== article.id) {
        await Newswire.deleteOne({ _id: lastSavedArticle._id });
      }
  
      const existingPost = await Newswire.findOne({ id: article.id });
      const channel = client.channels.cache.get('1008110383329988669');
      if (!channel) {
        console.error('Channel non trouvé.');
        return;
      }
  
      const now = new Date();
      const eventStartTime = new Date(now.getTime() + 10 * 1000).toISOString();
      let eventEndTime;
  
      if (article.title.includes('GTA+')) {
        eventEndTime = null;
      } else {
        const nextThursday = getNextThursday();
        eventEndTime = nextThursday.toISOString();
      }
  
      const postURL = `https://www.rockstargames.com/fr${articleUrl}`;
      const imageURL = article.imageURL;
  
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
  
        const embed = new EmbedBuilder()
          .setColor('#ffab00')
          .setTitle(article.title)
          .setURL(postURL)
          .setImage(imageURL)
          .setTimestamp(postDate)
          .setFooter({ text: 'Rockstar Newswire', iconURL: 'https://yt3.googleusercontent.com/4QkVmN1SUUzSUbINQoDdolNKnh_25YQL4zyn7RUlxuBmwmT-j_mUgEF5_DFbwcU-ux3R0fVI=s900-c-k-c0x00ffffff-no-rj' })
          .setDescription(article.subtitle + '\n\n' + article.blurb);
  
        const button = new ButtonBuilder()
          .setLabel('Lire l\'article')
          .setStyle(ButtonStyle.Link)
          .setURL(postURL);
  
        const actionRow = new ActionRowBuilder().addComponents(button);
  
        await channel.send({
          embeds: [embed],
          components: [actionRow]
        });
  
        const maxNameLength = 100;
let title = article.title;

// Truncate the title if it exceeds the maximum length
if (title.length > maxNameLength) {
    title = title.substring(0, maxNameLength);
}

const eventData = {
    name: title,
    description: `${article.subtitle}\n\nLien : ${postURL}`,
    scheduledStartTime: eventStartTime,
    scheduledEndTime: eventEndTime,
    privacyLevel: 2,
    entityType: 3,
    entityMetadata: {
        location: "Rockstar Newswire",
    },
    reason: "Création d'un événement via commande",
};

if (imageURL && (imageURL.endsWith('.jpg') || imageURL.endsWith('.png') || imageURL.endsWith('.jpeg'))) {
    eventData.image = imageURL;
}

await channel.guild.scheduledEvents.create(eventData);

    }
  } catch (error) {
    console.error('Erreur lors de la récupération ou de la mise à jour des nouvelles :', error);
  }

}

fetchAndUpdateNews();
setInterval(fetchAndUpdateNews, 10 * 60 * 1000);

const GTAPlusArticle = require('../../models/gtaPlus'); // Nouveau modèle pour GTA+

async function fetchLatestGTAPlusArticleUrl() {
  try {
    const response = await axios.get(listUrl);
    const posts = response.data.data.posts.results || [];

    if (posts.length > 0) {
      let latestPost = posts[0];

      // Vérifier si le titre contient "GTA+"
      if (latestPost.title.includes('GTA+')) {
        // Récupérer l'URL de l'article
        const articleUrl = latestPost.url;
        const detailUrl = `https://graph.rockstargames.com/?origin=https://www.rockstargames.com&operationName=NewswirePost&variables=%7B"locale"%3A"fr_fr"%2C"id_hash"%3A"${latestPost.id}"%7D&extensions=%7B"persistedQuery"%3A%7B"version"%3A1%2C"sha256Hash"%3A"555658813abe5acc8010de1a1feddd6fd8fddffbdc35d3723d4dc0fe4ded6810"%7D%7D`;
        return { detailUrl, articleUrl };
      }
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    return null;
  }
}

async function fetchNewsGTAPlusData(detailUrl) {
  try {
    const response = await axios.get(detailUrl);
    const data = response.data.data.post || {};

    let imageURL = 'https://via.placeholder.com/500';
    if (data.tina && data.tina.payload && data.tina.payload.meta && data.tina.payload.meta.preview_images && data.tina.payload.meta.preview_images.en_us) {
      const previewImages = data.tina.payload.meta.preview_images.en_us;
      const imagePath = previewImages['newswire-block-16x9'];
      if (imagePath) {
        imageURL = `https://media-rockstargames-com.akamaized.net${imagePath}`;
      }
    }

    return { ...data, imageURL };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'article :', error);
    return {};
  }
}

function getEndOfMonth() {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDayOfMonth.setHours(11, 0, 0, 0); // 11h du dernier jour du mois
  return lastDayOfMonth;
}

async function processGTAPlusArticles() {
  try {
    const result = await fetchLatestGTAPlusArticleUrl();
    if (!result) {
      return;
    }

    const { detailUrl, articleUrl } = result;

    const article = await fetchNewsGTAPlusData(detailUrl);
    if (!article || !article.id) {

      return;
    }

    const existingPost = await GTAPlusArticle.findOne({ id: article.id });
    const channel = client.channels.cache.get('1008110383329988669');
    if (!channel) {
      console.error('Channel non trouvé.');
      return;
    }

    const now = new Date();
    const eventStartTime = new Date(now.getTime() + 10 * 1000).toISOString(); // 10 secondes après maintenant
    const eventEndTime = getEndOfMonth().toISOString();

    if (!existingPost) {
      const postDate = new Date(article.created.split(' ')[0].split('/').reverse().join('-') + 'T' + article.created.split(' ')[1] + ':00Z');

      const newPost = new GTAPlusArticle({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        date: postDate,
        locale: article.locale || 'fr_fr',
        imageURL: article.imageURL
      });

      await newPost.save();

      const postURL = `https://www.rockstargames.com/fr${articleUrl}`;
      const imageURL = article.imageURL;

      const embed = new EmbedBuilder()
        .setColor('#ffab00')
        .setTitle(article.title)
        .setURL(postURL)
        .setImage(imageURL)
        .setTimestamp(postDate)
        .setFooter({ text: 'Rockstar Newswire', iconURL: 'https://yt3.googleusercontent.com/4QkVmN1SUUzSUbINQoDdolNKnh_25YQL4zyn7RUlxuBmwmT-j_mUgEF5_DFbwcU-ux3R0fVI=s900-c-k-c0x00ffffff-no-rj' })
        .setDescription(article.subtitle || 'Aucune description disponible');

      const button = new ButtonBuilder()
        .setLabel('Lire l\'article')
        .setStyle(ButtonStyle.Link)
        .setURL(postURL);

      const actionRow = new ActionRowBuilder().addComponents(button);

      await channel.send({
        embeds: [embed],
        components: [actionRow]
      });

    }
  } catch (error) {
    console.error('Erreur lors de la récupération ou de la mise à jour des nouvelles :', error);
  }
}


processGTAPlusArticles();
setInterval(processGTAPlusArticles, 10 * 60 * 1000);

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

// Fonction pour déterminer la couleur globale
function determineEmbedColor(statuses) {
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

  if (allStatuses.some(status => status === 'DOWN')) {
      return '#ef3939'; // Rouge si au moins un service est inactif
  } else if (allStatuses.some(status => status === 'LIMITED')) {
      return '#ffab00'; // Jaune si au moins un service est limité
  } else {
      return '#43b581'; // Vert si tous les services sont en ligne
  }
}

async function fetchAndFormatStatuses() {
    const response = await fetchRockstarStatus();
    const statuses = response;

    if (!statuses) {
        throw new Error('Erreur lors de la récupération des statuts');
    }

    const gtaopc = formatStatus(statuses.gtao.pc, '`PC`');
    const gtaops4 = formatStatus(statuses.gtao.ps4, '`PS4`');
    const gtaoone = formatStatus(statuses.gtao.xboxOne, '`Xbox One`');
    const gtaops5 = formatStatus(statuses.gtao.ps5, '`PS5`');
    const gtaoserie = formatStatus(statuses.gtao.xboxSerie, '`Xbox Series X/S`');

    const socialClub = formatStatus(statuses.socialClub.all, '`Toutes les fonctionnalités`');

    const authentification = formatStatus(statuses.launcher.authentication, '`Authentification`');
    const store = formatStatus(statuses.launcher.store, '`Boutique`');
    const cloud = formatStatus(statuses.launcher.cloud, '`Services du cloud`');
    const downloads = formatStatus(statuses.launcher.downloads, '`Téléchargements`');

    const now = new Date();
    const nextUpdate = new Date(now.getTime() + 10 * 60 * 1000);

    const maintenanceMessage = determineMaintenance(statuses);
    const embedColor = determineEmbedColor(statuses); // Utilise la couleur déterminée

    return {
        gtao: `${gtaopc}\n${gtaops5}\n${gtaoserie}\n${gtaops4}\n${gtaoone}`,
        socialClub,
        launcher: `${authentification}\n${store}\n${cloud}\n${downloads}`,
        Update : statuses.lastUpdate,
        lastUpdate: now.toLocaleTimeString(),
        nextUpdate: nextUpdate.toLocaleTimeString(),
        maintenanceMessage,
        embedColor
    };
}

async function sendStatusEmbed() {
    const channelId = '1024410723159392266';
    const channel = await client.channels.fetch(channelId);

    const status = await fetchAndFormatStatuses();

    const postUrl = 'https://support.rockstargames.com/fr/servicestatus?tz=Europe/Paris';

    const embed = new EmbedBuilder()
        .setTitle('État des services Rockstar Games')
        .setURL(postUrl)
        .setDescription(status.Update)
        .addFields(
            { name: "Grand Theft Auto Online", value: status.gtao, inline: false },
            { name: "Rockstar Games Launcher", value: status.launcher, inline: false },
            { name: "Services en ligne", value: status.socialClub, inline: false }
        )
        .setColor(status.embedColor) // Définition de la couleur dynamique
        .setFooter({ text: `Prochaine actualisation à ${status.nextUpdate}` });

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
checkAndUpdateTweet()
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