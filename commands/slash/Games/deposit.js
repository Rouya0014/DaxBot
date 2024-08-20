const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "deposit",
  description: "🪙 | Déposez de l'argent à la banque.",
  type: 1,
  options: [
    {
      name: "montant",
      description: "Le montant que vous souhaitez déposer (ou 'all' pour tout déposer).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  
  run: async (client, interaction) => {
    const amountInput = interaction.options.getString("montant");
    const user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!user || user.cash <= 0) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas d'argent liquide à déposer.", ephemeral: true });
    }

    let amount;
    if (amountInput.toLowerCase() === "all") {
      amount = user.cash;
    } else {
      amount = parseInt(amountInput);
      if (isNaN(amount) || amount <= 0 || amount > user.cash) {
        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Montant invalide.", ephemeral: true });
      }
    }

    await casinoSchema.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $inc: { cash: -amount, bank: amount } },
      { upsert: true, new: true }
    );

    const embed = new EmbedBuilder()
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`Vous avez déposé **${amount}** <:IconCasinoChips:1008768785869713551> à la banque !`)
      .setColor('#278048');

    return interaction.reply({ embeds: [embed] });
  },
};