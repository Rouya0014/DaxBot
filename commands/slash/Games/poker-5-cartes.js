const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const ms = require('ms');
const casinoSchema = require('../../../models/casino');

// Map des émojis pour chaque carte
const cardEmojis = {
  '2C': '<:2C:1273631052358877277>', '3C': '<:3C:1273631332051980390>', '4C': '<:4C:1273633647693529201>',
  '5C': '<:5C:1273633756464418896>', '6C': '<:6C:1273634846014570539>', '7C': '<:7C:1273634958212202518>',
  '8C': '<:8C:1273635908641361984>', '9C': '<:9C:1273635987808977016>', '10C': '<:10C:1273636922056638514>',
  'jC': '<:jC:1273637022971596892>', 'qC': '<:qC:1273638785409749086>', 'kC': '<:kC:1273638883887677591>',
  'aC': '<:aC:1273639509636026430>', 

  '2D': '<:2D:1273631050874224700>', '3D': '<:3D:1273631330646888519>', '4D': '<:4D:1273633646301151451>',
  '5D': '<:5D:1273633755319242885>', '6D': '<:6D:1273634844559278172>', '7D': '<:7D:1273634956790333451>',
  '8D': '<:8D:1273635907072954529>', '9D': '<:9D:1273635986634576048>', '10D': '<:10D:1273636920596889652>',
  'jD': '<:jD:1273637021939663018>', 'qD': '<:qD:1273638784382144563>', 'kD': '<:kD:1273638882084261930>',
  'aD': '<:aD:1273639511582179338>', 

  '2H': '<:2H:1273631049338851432>', '3H': '<:3H:1273631335629590600>', '4H': '<:4H:1273633644996595764>',
  '5H': '<:5H:1273633754208010271>', '6H': '<:6H:1273634843330347061>', '7H': '<:7H:1273634955435704350>',
  '8H': '<:8H:1273635905558810674>', '9H': '<:9H:1273635985355309097>', '10H': '<:10H:1273636919351181444>',
  'jH': '<:jH:1273637019830059039>', 'qH': '<:qH:1273638782897225792>', 'kH': '<:kH:1273638880934891582>',
  'aH': '<:aH:1273639513058447370>', 

  '2S': '<:2S:1273631047938084918>', '3S': '<:3S:1273631333779767319>', '4S': '<:4S:1273633643817865296>',
  '5S': '<:5S:1273633752173777002>', '6S': '<:6S:1273634841941901423>', '7S': '<:7S:1273634953544073316>',
  '8S': '<:8S:1273635903964840017>', '9S': '<:9S:1273635983736180768>', '10S': '<:10S:1273636917912539146>',
  'jS': '<:jS:1273637018773094480>', 'qS': '<:qS:1273638781844717630>', 'kS': '<:kS:1273638879295045805>',
  'aS': '<:aS:1273639514564329554>', 

  'back': '<:cardBack:1273638977496289321>'
};
  
  // Fonction pour créer un deck de cartes avec des émojis
  function createDeck() {
    const suits = ['C', 'D', 'H', 'S']; // Trèfle, Carreau, Coeur, Pique
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
    return suits.flatMap(suit => ranks.map(rank => ({ suit, rank, emoji: cardEmojis[rank + suit] })));
  }
  
  // Fonction pour mélanger le deck
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  
  // Fonction pour vérifier si une main est une paire
  function isPair(ranks) {
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    return Object.values(rankCounts).includes(2);
  }
  
  // Fonction pour vérifier si une main est une double paire
  function isTwoPair(ranks) {
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    const pairs = Object.values(rankCounts).filter(count => count === 2);
    return pairs.length === 2;
  }
  
  // Fonction pour vérifier si une main est un brelan
  function isThreeOfAKind(ranks) {
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    return Object.values(rankCounts).includes(3);
  }
  
  // Fonction pour vérifier si une main est un full house
  function isFullHouse(ranks) {
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    return counts[0] === 3 && counts[1] === 2;
  }
  
  // Fonction pour vérifier si une main est un carré
  function isFourOfAKind(ranks) {
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    return Object.values(rankCounts).includes(4);
  }
  
  // Fonction pour vérifier si une main est une quinte flush
  function isStraightFlush(ranks, suits) {
    return isFlush(suits) && isStraight(ranks);
  }
  
  // Fonction pour vérifier si une main est une quinte flush royale
  function isRoyalFlush(ranks, suits) {
    const royalRanks = ['a', 'k', 'q', 'j', '10'];
    const hasRoyal = royalRanks.every(rank => ranks.includes(rank));
    return hasRoyal && isFlush(suits) && isStraight(ranks);
  }
  
  // Fonction pour vérifier si une main est une couleur
  function isFlush(suits) {
    return new Set(suits).size === 1;
  }
  
  // Fonction pour vérifier si une main est une quinte
  function isStraight(ranks) {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
    const indices = ranks.map(rank => rankOrder.indexOf(rank)).sort((a, b) => a - b);
  
    // Vérifie si les indices sont consécutifs (séquence)
    return indices.every((val, index, arr) => index === 0 || val - arr[index - 1] === 1);
  }
  
  // Fonction pour trouver la carte haute dans une main
  function getHighCard(hand) {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
    const sortedHand = hand.sort((a, b) => rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank));
    return sortedHand[0];
  }

  // Fonction pour convertir une carte en chaîne de caractères avec son émoji
function cardToString(card) {
    const rankNames = {
      '2': 'Deux', '3': 'Trois', '4': 'Quatre', '5': 'Cinq', '6': 'Six', '7': 'Sept',
      '8': 'Huit', '9': 'Neuf', '10': 'Dix', 'j': 'Valet', 'q': 'Dame', 'k': 'Roi', 'a': 'As'
    };
  
    return card.emoji ? card.emoji : `${rankNames[card.rank] || card.rank} de ${card.suit}`;
  }
  
  function evaluateHand(hand) {
    const ranks = hand.map(card => card.rank);
    const suits = hand.map(card => card.suit);

    const rankCounts = {};
    ranks.forEach(rank => {
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    }); 

    const uniqueRanks = new Set(ranks);

    let evaluation = '';
    let score = 0;
    let highCard = null;
    let pairRank = null;

    if (isRoyalFlush(ranks, suits)) {
        evaluation = 'Quinte Flush Royale';
        score = 10;
    } else if (isStraightFlush(ranks, suits)) {
        evaluation = 'Quinte Flush';
        score = 9;
    } else if (isFourOfAKind(ranks)) {
        evaluation = 'Carré';
        score = 8;
    } else if (isFullHouse(ranks)) {
        evaluation = 'Full-House';
        score = 7;
    } else if (isFlush(suits)) {
        evaluation = 'Couleur';
        score = 6;
    } else if (isStraight(ranks)) {
        evaluation = 'Quinte';
        score = 5;
    } else if (isThreeOfAKind(ranks)) {
        evaluation = 'Brelan';
        score = 4;
    } else if (isTwoPair(ranks)) {
        evaluation = 'Double Paire';
        score = 3;
    } else if (isPair(ranks)) {
        evaluation = 'Paire';
        score = 2;
        const pairRankKey = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);
        pairRank = convertRankToFullName(pairRankKey);
    } else {
        evaluation = 'Hauteur';
        score = 1;
        highCard = getHighCard(hand);
    }

    return { evaluation, score, highCard, pairRank };
}

function convertRankToFullName(rank) {
  const rankNames = {
    'j': 'Valet', 'q': 'Dame', 'k': 'Roi', 'a': 'As'
  };

  return rankNames[rank] || rank;
}
  

module.exports = {
  name: "poker5",
  description: "🎰 | Jouez au Poker à 5 cartes.",
  type: 1,
  options: [
    {
      name: "mise",
      description: "Montant de la mise initiale.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",
  run: async (client, interaction) => {
    const initialBet = interaction.options.getInteger("mise");

    // Obtenir les informations de l'utilisateur depuis la base de données
    let user = await casinoSchema.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

    if (!user) {
        // Si l'utilisateur n'a pas de compte, le créer avec un solde de 0
        user = new casinoSchema({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            cash: 0,
            bank: 0
        });
    }

    if (initialBet > 20000) {
        return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous ne pouvez pas miser plus de 20 000 <:IconCasinoChips:1008768785869713551>`, ephemeral: true });
    }

    if (initialBet <= 0) {
      return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
  }

    if (initialBet > user.cash) {
        return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de jetons en liquide pour faire ce pari.`, ephemeral: true });
    }

    let deck = shuffleDeck(createDeck());
    const playerHand = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];

    let gameEnded = false;

    // Mettre à jour la base de données avec la mise initiale
    user.cash -= initialBet;
    await user.save();

    const playerHandEvaluation = evaluateHand(playerHand);
    const dealerHandEvaluation = evaluateHand(dealerHand);

    let playerHandValue = playerHandEvaluation.evaluation;
    if (playerHandEvaluation.evaluation === 'Hauteur') {
        playerHandValue += ` (${cardToString(playerHandEvaluation.highCard)})`;
    }

    let dealerHandValue = dealerHandEvaluation.evaluation;
    if (dealerHandEvaluation.evaluation === 'Hauteur') {
        dealerHandValue += ` (${cardToString(dealerHandEvaluation.highCard)})`;
    }

    const embed = new EmbedBuilder()
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
        .addFields(
            {name: 'Votre main', value: `${playerHand.map(cardToString).join(' ')}\n\nValeur : ${playerHandValue}${playerHandEvaluation.pairRank ? ` (${playerHandEvaluation.pairRank})` : ''}`, inline: true},
            {name: 'Main du croupier', value: `${cardEmojis.back} ${cardEmojis.back} ${cardEmojis.back} ${cardEmojis.back} ${cardEmojis.back}`, inline: true}
        )
        .setColor('#5865f2')
        

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('fold').setLabel('Passer').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('play').setLabel('Relancer').setStyle(ButtonStyle.Primary)
        );

    const message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

    const filter = i => i.customId === 'fold' || i.customId === 'play';
    const collector = message.createMessageComponentCollector({ filter, time: ms('2m') });

    collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({ content: 'Ce bouton n\'est pas pour vous.', ephemeral: true });
        }

        if (i.customId === 'fold') {
            gameEnded = true;
            const foldEmbed = new EmbedBuilder()
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
                .addFields(
                    {name: 'Votre main', value: `Vous avez abandonné.`, inline: true},
                    {name: 'Main du croupier', value: `${dealerHand.map(cardToString).join(' ')}`}
                )
                .setColor('#f6a72d') // Jaune pour le passage
                

            user.cash += initialBet;
            await user.save();

            return i.update({ embeds: [foldEmbed], components: [] });
        } else if (i.customId === 'play') {
            const dealerHandStr = dealerHand.map(cardToString).join(' ');
            const playerHandStr = playerHand.map(cardToString).join(' ');

            const playerHandEvaluation = evaluateHand(playerHand);
            const dealerHandEvaluation = evaluateHand(dealerHand);

            let result = '';
            let color = '#5865f2'; // Couleur par défaut

            if (playerHandEvaluation.score > dealerHandEvaluation.score) {
                result = `Résultat : vous remportez ${initialBet * 2} <:IconCasinoChips:1008768785869713551>`;
                user.cash += initialBet * 2; // Gains = Mise initiale * 2
                color = '#278048'; // Vert pour la victoire
            } else if (playerHandEvaluation.score < dealerHandEvaluation.score) {
                result = `Résultat : Vous perdez ${initialBet} <:IconCasinoChips:1008768785869713551>`;
                color = '#ee2346'; // Rouge pour la perte
            } else {
                // Égalité : comparer les cartes hautes
                const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
                const playerHighCardRankIndex = rankOrder.indexOf(playerHandEvaluation.highCard.rank);
                const dealerHighCardRankIndex = rankOrder.indexOf(dealerHandEvaluation.highCard.rank);

                if (playerHighCardRankIndex > dealerHighCardRankIndex) {
                    result = `Résultat : vous remportez ${initialBet * 2} <:IconCasinoChips:1008768785869713551>`;
                    user.cash += initialBet * 2; // Gains = Mise initiale * 2
                    color = '#278048'; // Vert pour la victoire
                } else if (playerHighCardRankIndex < dealerHighCardRankIndex) {
                    result = `Résultat : Vous perdez ${initialBet} <:IconCasinoChips:1008768785869713551>`;
                    color = '#ee2346'; // Rouge pour la perte
                } else {
                    result = `Résultat : égalité ! Aucun jeton n'est gagné ou perdu.`;
                    user.cash += initialBet; // Restituer les jetons en cas d'égalité
                    color = '#f6a72d'; // Jaune pour l'égalité
                }
            }

            await user.save();

            const playEmbed = new EmbedBuilder()
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true })})
                .setDescription(result)
                .addFields(
                    {name: 'Votre main', value: `${playerHandStr}\n\nValeur : ${playerHandValue}${playerHandEvaluation.pairRank ? ` (${playerHandEvaluation.pairRank})` : ''}`, inline: true},
                    {name: 'Main du croupier', value: `${dealerHandStr}\n\nValeur : ${dealerHandValue}${dealerHandEvaluation.pairRank ? ` (${dealerHandEvaluation.pairRank})` : ''}`, inline: true}
                )
                .setColor(color)
                

            i.update({ embeds: [playEmbed], components: [] });
            gameEnded = true;
        }
    });

    collector.on('end', async () => {
        if (!gameEnded) {
            const dealerHandStr = dealerHand.map(cardToString).join(' ');
            const playerHandStr = playerHand.map(cardToString).join(' ');

            const dealerHandEvaluation = evaluateHand(dealerHand);
            const playerHandEvaluation = evaluateHand(playerHand);

            let result = '';
            let color = '#5865f2'; // Couleur par défaut

            if (playerHandEvaluation.score > dealerHandEvaluation.score) {
                result = `Résultat : vous remportez ${initialBet * 2} <:IconCasinoChips:1008768785869713551>`;
                user.cash += initialBet * 2; // Gains = Mise initiale * 2
                color = '#278048'; // Vert pour la victoire
            } else if (playerHandEvaluation.score < dealerHandEvaluation.score) {
                result = `Résultat : Vous perdez ${initialBet} <:IconCasinoChips:1008768785869713551>`;
                color = '#ee2346'; // Rouge pour la perte
            } else {
                // Égalité : comparer les cartes hautes
                const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
                const playerHighCardRankIndex = rankOrder.indexOf(playerHandEvaluation.highCard.rank);
                const dealerHighCardRankIndex = rankOrder.indexOf(dealerHandEvaluation.highCard.rank);

                if (playerHighCardRankIndex > dealerHighCardRankIndex) {
                    result = `Résultat : vous remportez ${initialBet * 2} <:IconCasinoChips:1008768785869713551>`;
                    user.cash += initialBet * 2; // Gains = Mise initiale * 2
                    color = '#278048'; // Vert pour la victoire
                } else if (playerHighCardRankIndex < dealerHighCardRankIndex) {
                    result = `Résultat : Vous perdez ${initialBet} <:IconCasinoChips:1008768785869713551>`;
                    color = '#ee2346'; // Rouge pour la perte
                } else {
                    result = `Résultat : égalité ! Aucun jeton n'est gagné ou perdu.`;
                    user.cash += initialBet; // Restituer les jetons en cas d'égalité
                    color = '#f6a72d'; // Jaune pour l'égalité
                }
            }

            // Sauvegarder les modifications dans la base de données
            await user.save();

            // Créer l'embed pour le résultat de la partie à la fin du temps
            const endEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                .setDescription(result)
                .addFields(
                    { name: 'Votre main', value: `${playerHandStr}\n\nValeur : ${playerHandValue}${playerHandEvaluation.pairRank ? ` (${playerHandEvaluation.pairRank})` : ''}`, inline: true },
                    { name: 'Main du croupier', value: `${dealerHandStr}\n\nValeur : ${dealerHandValue}${dealerHandEvaluation.pairRank ? ` (${dealerHandEvaluation.pairRank})` : ''}`, inline: true }
                )
                .setColor(color) // Appliquer la couleur appropriée

            // Mettre à jour le message avec le résultat de la partie à la fin du temps
            interaction.editReply({ embeds: [endEmbed], components: [] });
            }
        });
    }
}