const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const casinoSchema = require('../../../models/casino');

module.exports = {
  name: 'slots',
  description: '🎰 | Jouez à la machine à sous.',
  type: 1,
  options: [
    {
      name: 'montant',
      description: 'Le montant de jetons que vous souhaitez parier (maximum 4,000 jetons)',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  category: 'Games',
  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const betAmount = interaction.options.getInteger('montant');

    const maxBet = 4000;

    if (betAmount <= 0) {
      return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
    }

    if (betAmount > maxBet) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous ne pouvez pas parier plus de ${maxBet} <:IconCasinoChips:1008768785869713551>`, ephemeral: true });
    }

    let userData = await casinoSchema.findOne({ userId, guildId });

    if (!userData || userData.cash < betAmount) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de <:IconCasinoChips:1008768785869713551> en liquide pour faire ce pari.", ephemeral: true });
    }

    // Symboles de la machine à sous
    const symbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎'];
    const wildSymbol = '💎'; // Symbole Wild
    const scatterSymbol = '⭐'; // Symbole Scatter

    // Fonction pour tirer une ligne de la machine à sous
    const spin = () => {
      return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
    };

    // Tirage final de la machine à sous
    const result = spin();
    let color = '#5865f2';

    // Calcul des gains
    const calculatePayout = (symbols) => {
      const [a, b, c] = symbols;

      if (a === b && b === c) {
        // Jackpot : Trois symboles identiques
        if (a === wildSymbol) return betAmount * 15; // Wild Jackpot
        return betAmount * 10; // Jackpot normal
      } else if ((a === b || b === c || a === c) && (a === wildSymbol || b === wildSymbol || c === wildSymbol)) {
        // Avec Wild
        return betAmount * 5; // Gain avec un Wild
      } else if (a === b || b === c || a === c) {
        // Deux symboles identiques
        return betAmount * 3; // Gain avec deux identiques
      } else if (symbols.includes(scatterSymbol)) {
        // Scatter
        return betAmount * 4; // Gain Scatter
      } else {
        // Aucun gain
        return 0;
      }
    };

    let payout = calculatePayout(result);
    let resultMessage;

    if (payout > 0) {
      userData.cash += payout;
      resultMessage = `Résultat : vous remportez ${payout} <:IconCasinoChips:1008768785869713551>`;
      color = '#278048'; // Vert pour la victoire
    } else {
      userData.cash -= betAmount;
      resultMessage = `Résultat : Vous perdez ${betAmount} <:IconCasinoChips:1008768785869713551>`;
      color = '#ee2346';
    }

    await userData.save();

    // Animation des rouleaux
    const slots = ['⬛', '⬛', '⬛'];
    let spinMessage = await interaction.reply({ content: '🎰 Tirage en cours...', fetchReply: true });

    const revealSlots = async () => {
      const spins = [6, 6, 6]; // Nombre de tours pour chaque case

      for (let i = 0; i < Math.max(...spins); i++) {
        const currentSpins = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];

        // Ajuster la vitesse pour chaque rouleau
        const animationEmbed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
          .setColor('#5865f2')
          .setDescription(
            `${i < spins[0] ? currentSpins[0] : result[0]} | ` +
            `${i < spins[1] ? currentSpins[1] : result[1]} | ` +
            `${i < spins[2] ? currentSpins[2] : result[2]}`
          );
        
        await spinMessage.edit({ embeds: [animationEmbed] });
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause de 100ms entre chaque étape
      }

      // Affichage des résultats finaux
      const finalEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
        .setColor(color)
        .setDescription(`${resultMessage}\n\n${result.join(' | ')}`);

      await spinMessage.edit({ content: null, embeds: [finalEmbed] });
    };

    revealSlots();
  },
};