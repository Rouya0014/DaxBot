const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const casinoSchema = require("../../../models/casino");

module.exports = {
  name: "balance",
  description: "🪙 | Affichez votre solde ou celui d'un autre utilisateur.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur dont vous souhaitez voir le solde.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  run: async (client, interaction) => {
    const targetUser = interaction.options.getUser("utilisateur") || interaction.user;

    const user = await casinoSchema.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

    if (!user) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> **${targetUser.username}** n'a aucun compte enregistré.`, ephemeral: true });
    } 

    // Récupérer tous les utilisateurs pour calculer le classement
    const allUsers = await casinoSchema.find({ guildId: interaction.guild.id }).exec();
    allUsers.sort((a, b) => (b.cash + b.bank) - (a.cash + a.bank));

    const rank = allUsers.findIndex(u => u.userId === targetUser.id) + 1;

    const embed = new EmbedBuilder()
      .setAuthor({name: targetUser.username, iconURL: targetUser.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`Rang du classement : ${rank}`)
      .addFields(
        { name: "Argent en liquide", value: `${user.cash} <:IconCasinoChips:1008768785869713551>`, inline: true },
        { name: "Banque", value: `${user.bank} <:IconCasinoChips:1008768785869713551>`, inline: true },
        { name: "Total", value: `${user.cash + user.bank} <:IconCasinoChips:1008768785869713551>`, inline: true }
      )
      .setColor('#5865f2');

    return interaction.reply({ embeds: [embed] });
  },
};