const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const cooldowns = new Set();

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {

  function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 const LevelSchema = require('../../models/levels')
 const calculateLevelXp = require('../../models/utils/calculeteLevelXp');

  const { guild, author } = message;

  if(!guild || author.bot || message.channel.type !== 0) return;

  const xpToGive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await LevelSchema.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(`${message.member} Tu viens de monter au niveau ${level.level} !`);
      }

      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }

    // if (!level)
    else {
      // create new level
      const newLevel = new LevelSchema({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
})