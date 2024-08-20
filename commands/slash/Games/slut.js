const { EmbedBuilder } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "slut",
  description: "🪙 | Tentez de gagner de l'argent de manière douteuse.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  
  run: async (client, interaction) => {
    const user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    const now = new Date();
    const cooldown = 6 * 60 * 60 * 1000; // 6 heures en millisecondes

    if (user && user.lastSlut && now - user.lastSlut < cooldown) {
      const remainingTime = cooldown - (now - user.lastSlut);
      const timeLeft = new Date(remainingTime).toISOString().substr(11, 8);
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous devez attendre encore **${timeLeft}** avant de pouvoir réessayer.`, ephemeral: true });
    }

    const chance = Math.random();
    let amount;
    if (chance < 0.05) {
      amount = 2000;
    } else {
      amount = Math.floor(Math.random() * 1501) + 500;
    }

    const success = chance < 0.75; // 75% de chance de réussir
    if (success) {
      await casinoSchema.findOneAndUpdate(
        { userId: interaction.user.id, guildId: interaction.guild.id },
        { $inc: { cash: amount }, lastSlut: now },
        { upsert: true, new: true }
      );
      const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
        .setDescription(`Réussite douteuse ! Vous avez gagné **${amount}** <:IconCasinoChips:1008768785869713551>.`)
        .setColor('#278048');

      return interaction.reply({ embeds: [embed] });
    } else {
      amount = Math.floor(amount / 2);
      await casinoSchema.findOneAndUpdate(
        { userId: interaction.user.id, guildId: interaction.guild.id },
        { $inc: { cash: -amount }, lastSlut: now },
        { upsert: true, new: true }
      );
      const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
        .setDescription(`Échec total ! Vous avez perdu **${amount}** <:IconCasinoChips:1008768785869713551>.`)
        .setColor('#ee2346');

      return interaction.reply({ embeds: [embed] });
    }
  },
};