const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "give",
  description: "🪙 | Donnez des jetons à un autre utilisateur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur à qui vous souhaitez donner des jetons.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "montant",
      description: "Le montant de jetons que vous souhaitez donner.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  run: async (client, interaction) => {
    const giverId = interaction.user.id;
    const receiver = interaction.options.getUser("utilisateur");
    const amount = interaction.options.getInteger("montant");

    if (amount <= 0) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>", ephemeral: true });
    }

    if (receiver.id === giverId) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas vous donner des <:IconCasinoChips:1008768785869713551> à vous-même.", ephemeral: true });
    }

    // Vérification de l'existence des comptes
    const giverData = await casinoSchema.findOne({ userId: giverId, guildId: interaction.guild.id });
    const receiverData = await casinoSchema.findOne({ userId: receiver.id, guildId: interaction.guild.id });

    if (!giverData || giverData.cash < amount) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de <:IconCasinoChips:1008768785869713551> en liquide pour effectuer ce transfert.", ephemeral: true });
    }

    if (!receiverData) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> **${receiver.username}** n'a pas de compte enregistré.`, ephemeral: true });
    }

    // Mise à jour des soldes
    giverData.cash -= amount;
    receiverData.cash += amount;

    await giverData.save();
    await receiverData.save();

    // Message de confirmation
    const embed = new EmbedBuilder()
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`Vous avez donné **${amount}** <:IconCasinoChips:1008768785869713551> à **${receiver.username}**.`)
      .setColor("#278048")

    return interaction.reply({ embeds: [embed] });
  },
};
