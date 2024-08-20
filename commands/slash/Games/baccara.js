const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const casinoSchema = require("../../../models/casino");

// Votre objet cardEmojis
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

module.exports = {
    name: 'baccara',
    description: '🎰 | Jouez au Baccarat.',
    type: 1,
    options: [
        {
            name: 'mise',
            description: 'Le montant de jetons que vous souhaitez parier',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'parier_sur',
            description: 'Sur qui souhaitez-vous parier ?',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Vous', value: 'joueur' },
                { name: 'Banque', value: 'banque' },
                { name: 'Égalité', value: 'egalite' },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
    },
    category: 'Games',
    run: async (client, interaction) => {
        const betAmount = interaction.options.getInteger('mise');
        const betOn = interaction.options.getString('parier_sur');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        if (betAmount <= 0) {
            return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
        }

        if (betAmount > 20000) {
            return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Le montant ne peut pas dépasser 20000 <:IconCasinoChips:1008768785869713551>`, ephemeral: true });
          }

        // Récupérer les données de l'utilisateur depuis la base de données
        let userData = await casinoSchema.findOne({ userId, guildId });

        if (!userData) { 
            userData = await casinoSchema.create({ userId, guildId, cash: 10000 }); // Initialiser avec 10000 si l'utilisateur n'existe pas encore
        }

        if (userData.cash < betAmount) {
            return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de <:IconCasinoChips:1008768785869713551> pour faire ce pari.", ephemeral: true });
        }

        // Distribution initiale des cartes
        let playerHand = drawCards(2);
        let bankerHand = drawCards(2);

        let playerTotal = calculateBaccaratTotal(playerHand);
        let bankerTotal = calculateBaccaratTotal(bankerHand);

        // Vérification des "Naturels"
        if (playerTotal >= 8 || bankerTotal >= 8) {
            return finalizeBaccaratGame(interaction, betAmount, betOn, playerHand, bankerHand, playerTotal, bankerTotal, userData);
        }

        // Distribution de la troisième carte selon les règles
        if (playerTotal <= 5) {
            playerHand.push(drawCards(1)[0]);
            playerTotal = calculateBaccaratTotal(playerHand);
        }

        if (shouldBankerDraw(bankerTotal, playerHand[2])) {
            bankerHand.push(drawCards(1)[0]);
            bankerTotal = calculateBaccaratTotal(bankerHand);
        }

        // Finalisation du jeu et affichage des résultats
        await finalizeBaccaratGame(interaction, betAmount, betOn, playerHand, bankerHand, playerTotal, bankerTotal, userData);
    },
};

function drawCards(count) {
    const cards = [];
    const suits = ['C', 'D', 'H', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

    for (let i = 0; i < count; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const rank = ranks[Math.floor(Math.random() * ranks.length)];
        cards.push(`${rank}${suit}`);
    }
    return cards;
}

function calculateBaccaratTotal(hand) {
    const total = hand.reduce((acc, card) => {
        const rank = card.slice(0, -1); // Extraire le rang de la carte
        const value = isNaN(rank) ? 0 : parseInt(rank); // 10, J, Q, K = 0
        return acc + (value > 9 ? 0 : value); // Les cartes au-dessus de 9 comptent pour 0
    }, 0);
    return total % 10;
}

function shouldBankerDraw(bankerTotal, playerThirdCard) {
    const playerThirdValue = playerThirdCard ? parseInt(playerThirdCard.slice(0, -1)) || 0 : 0;
  
    if (bankerTotal <= 2) return true;
    if (bankerTotal === 3 && playerThirdValue !== 8) return true;
    if (bankerTotal === 4 && playerThirdValue >= 2 && playerThirdValue <= 7) return true;
    if (bankerTotal === 5 && playerThirdValue >= 4 && playerThirdValue <= 7) return true;
    if (bankerTotal === 6 && playerThirdValue >= 6 && playerThirdValue <= 7) return true;
    return false;
}

async function finalizeBaccaratGame(interaction, betAmount, betOn, playerHand, bankerHand, playerTotal, bankerTotal, userData) {
    let resultMessage;
    let color;
    let gainOrLoss = 0;

    if (playerTotal > bankerTotal) {
        if (betOn === 'joueur') {
            gainOrLoss = betAmount * 2;
            userData.cash += betAmount; // Gain total = mise doublée
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            gainOrLoss = betAmount;
            userData.cash -= betAmount; // Le joueur perd sa mise
            resultMessage = `Résultat : Vous perdez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#ee2346'; // Rouge pour perte
        }
    } else if (bankerTotal > playerTotal) {
        if (betOn === 'banque') {
            gainOrLoss = betAmount * 2;
            userData.cash += betAmount; // Gain total = mise doublée sans commission
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            gainOrLoss = betAmount;
            userData.cash -= betAmount; // Le joueur perd sa mise
            resultMessage = `Résultat : Vous perdez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#ee2346'; // Rouge pour perte
        }
    } else {
        if (betOn === 'egalite') {
            gainOrLoss = betAmount * 8;
            userData.cash += betAmount * 7; // Gain net
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            resultMessage = `Résultat : égalité ! Jetons remboursés`;
            color = '#f5b342'; // Jaune pour égalité
        }
    }

    // Mettre à jour les données de l'utilisateur dans la base de données
    await casinoSchema.findOneAndUpdate({ userId: userData.userId, guildId: userData.guildId }, { cash: userData.cash });

    const playerHandEmojis = playerHand.map(card => cardEmojis[card]).join(' ');
    const bankerHandEmojis = bankerHand.map(card => cardEmojis[card]).join(' ');

    const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
        .setColor(color)
        .setDescription(resultMessage)
        .addFields(
            { name: 'Votre main', value: `${playerHandEmojis}\n\nTotal: ${playerTotal}`, inline: true },
            { name: 'Main de la Banque', value: `${bankerHandEmojis}\n\nTotal: ${bankerTotal}`, inline: true }
        );

    interaction.reply({ embeds: [embed] });
}


function shouldBankerDraw(bankerTotal, playerThirdCard) {
    const playerThirdValue = playerThirdCard ? parseInt(playerThirdCard.slice(0, -1)) || 0 : 0;
  
    if (bankerTotal <= 2) return true;
    if (bankerTotal === 3 && playerThirdValue !== 8) return true;
    if (bankerTotal === 4 && playerThirdValue >= 2 && playerThirdValue <= 7) return true;
    if (bankerTotal === 5 && playerThirdValue >= 4 && playerThirdValue <= 7) return true;
    if (bankerTotal === 6 && playerThirdValue >= 6 && playerThirdValue <= 7) return true;
    return false;
}

async function finalizeBaccaratGame(interaction, betAmount, betOn, playerHand, bankerHand, playerTotal, bankerTotal, userData) {
    let resultMessage;
    let color;
    let gainOrLoss = 0;

    if (playerTotal > bankerTotal) {
        if (betOn === 'joueur') {
            gainOrLoss = betAmount * 2;
            userData.cash += betAmount; // Gain total = mise doublée
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            gainOrLoss = betAmount;
            userData.cash -= betAmount; // Le joueur perd sa mise
            resultMessage = `Résultat : Vous perdez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#ee2346'; // Rouge pour perte
        }
    } else if (bankerTotal > playerTotal) {
        if (betOn === 'banque') {
            gainOrLoss = betAmount * 2;
            userData.cash += betAmount; // Gain total = mise doublée sans commission
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            gainOrLoss = betAmount;
            userData.cash -= betAmount; // Le joueur perd sa mise
            resultMessage = `Résultat : Vous perdez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#ee2346'; // Rouge pour perte
        }
    } else {
        if (betOn === 'egalite') {
            gainOrLoss = betAmount * 8;
            userData.cash += betAmount * 7; // Gain net
            resultMessage = `Résultat : Vous remportez ${gainOrLoss} <:IconCasinoChips:1008768785869713551>`;
            color = '#278048'; // Vert pour gain
        } else {
            resultMessage = `Résultat : égalité ! Jetons remboursés`;
            color = '#f5b342'; // Jaune pour égalité
        }
    }

    // Mettre à jour les données de l'utilisateur dans la base de données
    await casinoSchema.findOneAndUpdate({ userId: userData.userId, guildId: userData.guildId }, { cash: userData.cash });

    const playerHandEmojis = playerHand.map(card => cardEmojis[card]).join(' ');
    const bankerHandEmojis = bankerHand.map(card => cardEmojis[card]).join(' ');

    const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
        .setColor(color)
        .setDescription(resultMessage)
        .addFields(
            { name: 'Votre main', value: `${playerHandEmojis}\n\nTotal: ${playerTotal}`, inline: true },
            { name: 'Main de la Banque', value: `${bankerHandEmojis}\n\nTotal: ${bankerTotal}`, inline: true }
        );

    interaction.reply({ embeds: [embed] });
}
