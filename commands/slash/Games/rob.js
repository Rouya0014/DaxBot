const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "rob",
  description: "🪙 | Volez de l'argent à un autre utilisateur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous voulez voler",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  
  run: async (client, interaction) => {
    const target = interaction.options.getUser("utilisateur");

    // Vérifier si l'utilisateur cible est un bot
    if (target.bot) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous ne pouvez pas voler un bot !`, ephemeral: true });
    }

    const user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    const targetUser = await casinoSchema.findOne({ userId: target.id, guildId: interaction.guild.id });
    const now = new Date();
    const cooldown = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    if (user && user.lastRob && now - user.lastRob < cooldown) {
      const remainingTime = cooldown - (now - user.lastRob);
      const timeLeft = new Date(remainingTime).toISOString().substr(11, 8);
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous devez attendre encore **${timeLeft}** avant de pouvoir voler à nouveau.`, ephemeral: true });
    }

    if (!targetUser || targetUser.cash <= 0) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> L'utilisateur **${target.username}** n'a pas d'argent liquide à voler.`, ephemeral: true });
    }

    const maxStealAmount = Math.floor(targetUser.cash * 0.8);
    const stealAmount = Math.floor(Math.random() * maxStealAmount) + 1;
    const success = Math.random() < 0.5; // 50% de chance de réussir

    if (success) {
      await casinoSchema.findOneAndUpdate(
        { userId: interaction.user.id, guildId: interaction.guild.id },
        { $inc: { cash: stealAmount }, lastRob: now },
        { upsert: true, new: true }
      );
      await casinoSchema.findOneAndUpdate(
        { userId: target.id, guildId: interaction.guild.id },
        { $inc: { cash: -stealAmount } }
      );

      const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
        .setDescription(`Vous avez volé **${stealAmount}** <:IconCasinoChips:1008768785869713551> à **${target.username}**.`)
        .setColor('#278048');

      return interaction.reply({ embeds: [embed] });
    } else {
      const lossAmount = Math.floor(Math.random() * (user.cash * 0.3)) + 1;
      await casinoSchema.findOneAndUpdate(
        { userId: interaction.user.id, guildId: interaction.guild.id },
        { $inc: { cash: -lossAmount }, lastRob: now },
        { upsert: true, new: true }
      );

      const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
        .setDescription(`Vous avez été attrapé et avez perdu **${lossAmount}** <:IconCasinoChips:1008768785869713551>.`)
        .setColor('#ee2346');

      return interaction.reply({ embeds: [embed] });
    }
  },
};