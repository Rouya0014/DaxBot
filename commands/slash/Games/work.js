const { EmbedBuilder } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "work",
  description: "🪙 | Travaillez pour gagner de l'argent.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  
  run: async (client, interaction) => {
    const user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    const now = new Date();
    const cooldown = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

    if (user && user.lastWork && now - user.lastWork < cooldown) {
      const remainingTime = cooldown - (now - user.lastWork);
      const timeLeft = new Date(remainingTime).toISOString().substr(11, 8);
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous devez attendre encore **${timeLeft}** avant de pouvoir travailler à nouveau.`, ephemeral: true });
    }

    const amount = Math.floor(Math.random() * 1151) + 100; // Entre 100 et 1250
    await casinoSchema.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $inc: { cash: amount }, lastWork: now },
      { upsert: true, new: true }
    );

    const embed = new EmbedBuilder()
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`Travail effectué ! Vous avez gagné **${amount}** <:IconCasinoChips:1008768785869713551>.`)
      .setColor('#278048');

    return interaction.reply({ embeds: [embed] });
  },
};