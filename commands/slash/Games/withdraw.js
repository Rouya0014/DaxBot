const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "withdraw",
  description: "🪙 | Retirez de l'argent de la banque.",
  type: 1,
  options: [
    {
      name: "montant",
      description: "Le montant que vous souhaitez retirer (ou 'all' pour tout retirer).",
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

    if (!user || user.bank <= 0) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas d'argent en banque à retirer.", ephemeral: true });
    }

    let amount;
    if (amountInput.toLowerCase() === "all") {
      amount = user.bank;
    } else {
      amount = parseInt(amountInput);
      if (isNaN(amount) || amount <= 0 || amount > user.bank) {
        return interaction.reply({ content: "Montant invalide.", ephemeral: true });
      }
    }

    await casinoSchema.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { $inc: { bank: -amount, cash: amount } },
      { upsert: true, new: true }
    );

    const embed = new EmbedBuilder()
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`Vous avez retiré **${amount}** <:IconCasinoChips:1008768785869713551> de la banque !`)
      .setColor('#278048');

    return interaction.reply({ embeds: [embed] });
  },
};