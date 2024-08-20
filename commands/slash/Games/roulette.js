const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const casinoSchema = require('../../../models/casino');

// Les emojis représentant les deux versions de la roue
const rouletteEmojis = ['<:roulette1:1273593307867385928>', '<:roulette2:1273593306739249247>'];  // Remplace par tes propres emojis

module.exports = {
  name: 'roulette',
  description: '🎰 | Jouez à la roulette.',
  type: 1,
  options: [
    {
      name: 'pari',
      description: 'Sur quoi voulez-vous parier ? (rouge, noir, pair, impair, manque, passe)',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Rouge', value: 'rouge' },
        { name: 'Noir', value: 'noir' },
        { name: 'Pair', value: 'pair' },
        { name: 'Impair', value: 'impair' },
        { name: 'Manque (1-18)', value: 'manque' },
        { name: 'Passe (19-36)', value: 'passe' },
      ],
    },
    {
      name: 'mise',
      description: 'Le montant que vous voulez parier.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }, 
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  category: 'Games',

  run: async (client, interaction) => {
    const pari = interaction.options.getString('pari');
    let mise = interaction.options.getInteger('mise');

    // Limite de la mise à 20 000 jetons
    if (mise > 20000) {
      await interaction.reply({ content: `La mise maximale est de 20 000 <:IconCasinoChips:1008768785869713551>`, ephemeral: true });
    }

    if (mise <= 0) {
      return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
  }

    // Récupérer l'utilisateur
    const user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!user || user.cash < mise) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de <:IconCasinoChips:1008768785869713551> en liquide pour faire ce pari.`, ephemeral: true });
    }

    // Simulation de la roulette
    const number = Math.floor(Math.random() * 37); // Nombre de 0 à 36
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);
    const isBlack = !isRed && number !== 0;
    const isPair = number !== 0 && number % 2 === 0;
    const isImpair = number % 2 !== 0;
    const isManque = number >= 1 && number <= 18;
    const isPasse = number >= 19 && number <= 36;

    let win = false;
    let gain = 0;
    let couleur = '';

    if (isRed) {
      couleur = 'Rouge';
    } else if (isBlack) {
      couleur = 'Noir';
    } else {
      couleur = 'Vert'; // Le zéro est généralement considéré comme "vert"
    }

    switch (pari) {
      case 'rouge':
        if (isRed) win = true;
        break;
      case 'noir':
        if (isBlack) win = true;
        break;
      case 'pair':
        if (isPair) win = true;
        break;
      case 'impair':
        if (isImpair) win = true;
        break;
      case 'manque':
        if (isManque) win = true;
        break;
      case 'passe':
        if (isPasse) win = true;
        break;
      default:
        break;
    }

    if (win) {
      gain = mise * 2; // Les mises extérieures (rouge/noir, pair/impair, manque/passe) paient 1:1
      user.cash += gain;
    } else {
      user.cash -= mise;
    }

    await user.save();

    // Commence par différer la réponse pour indiquer que l'opération est en cours
    await interaction.deferReply();

    // Animation de la roulette
    for (let i = 0; i < 6; i++) {
      await interaction.editReply({ content: rouletteEmojis[i % rouletteEmojis.length] });
      await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 500ms entre chaque étape de l'animation
    }

    // Affichage du résultat final
    const embed = new EmbedBuilder()
      .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
      .setDescription(`La bille est tombée sur le numéro **${number}** (${couleur}).`)
      .addFields(
        { name: 'Résultat :', value: win ? `Vous remportez **${gain}** <:IconCasinoChips:1008768785869713551> !` : `Vous perdez votre mise de **${mise}** <:IconCasinoChips:1008768785869713551>`, inline: false },
        { name: 'Pari', value: pari, inline: true },
        { name: 'Mise', value: mise.toString(), inline: true },
      )
      .setColor(win ? '#278048' : '#ee2346');

    return interaction.editReply({ content: '', embeds: [embed] });
  },
};
