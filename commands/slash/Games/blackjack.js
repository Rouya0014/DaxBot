const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const casinoSchema = require('../../../models/casino');

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
  name: 'blackjack',
  description: "🎰 | Jouez au blackjack.",
  type: 1,
  options: [
    {
      name: 'montant',
      description: 'Le montant de jetons que vous souhaitez parier (maximum 20,000 jetons)',
      type: ApplicationCommandOptionType.Integer,
      required: true
    }
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "Games",

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const betAmount = interaction.options.getInteger('montant');

    if (betAmount > 20000) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas parier plus de 20,000 jetons.", ephemeral: true });
    }

    if (betAmount <= 0) {
      return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
  }

    let userData = await casinoSchema.findOne({ userId, guildId });
    if (!userData || userData.cash < betAmount) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de jetons en liquide pour faire ce pari.", ephemeral: true });
    }

    // Fonction mise à jour pour obtenir une carte avec son emoji correspondant
    const getRandomCard = () => {
      const suits = ['C', 'D', 'H', 'S'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
      const value = values[Math.floor(Math.random() * values.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const cardId = value + suit;
      const cardValue = value === 'a' ? 11 : (value === 'j' || value === 'q' || value === 'k' ? 10 : parseInt(value));
      return { cardId, cardValue };
    };

    const calculateHandValue = (hand) => {
      let sum = hand.reduce((acc, card) => acc + card.cardValue, 0);
      let aces = hand.filter(card => card.cardValue === 11).length;

      while (sum > 21 && aces) {
        sum -= 10;
        aces -= 1;
      }
      return sum;
    };

    let playerHand = [getRandomCard(), getRandomCard()];
    let dealerHand = [getRandomCard(), getRandomCard()];

    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    const blackjackEmbed = new EmbedBuilder()
      .setColor("#5865f2")
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
      .addFields(
        {
          name: `Votre main`,
          value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
          inline: true
        },
        {
          name: `Main du croupier`,
          value: `${cardEmojis[dealerHand[0].cardId]} <:cardBack:1273638977496289321> \n\nTotal : ${dealerHand[0].cardValue}`,
          inline: true
        }
      )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('hit').setLabel('Tirer').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('stand').setLabel('Rester').setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [blackjackEmbed], components: [row] });

    const filter = i => i.user.id === userId;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    const dealerTurn = async (i) => {
      while (dealerValue < playerValue && dealerValue < 21) {
        dealerHand.push(getRandomCard());
        dealerValue = calculateHandValue(dealerHand);
      }
    
      let resultEmbed;
    
      if (dealerValue > 21 || dealerValue < playerValue) {
        // Joueur gagne
        userData.cash += betAmount;
        await userData.save();
    
        resultEmbed = new EmbedBuilder()
          .setColor("#278048")
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
          .setDescription(`Résultat : vous remportez **${betAmount}** <:IconCasinoChips:1008768785869713551>`)
          .addFields(
            {
              name: `Votre main`,
              value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
              inline: true
            },
            {
              name: `Main du croupier`,
              value: `${dealerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${dealerValue}`,
              inline: true
            }
          )
          
      } else if (dealerValue === playerValue) {
        // Égalité
        resultEmbed = new EmbedBuilder()
          .setColor("#f6a72d")
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
          .setDescription(`Résultat : égalité ! Jetons remboursés`)
          .addFields(
            {
              name: `Votre main`,
              value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
              inline: true
            },
            {
              name: `Main du croupier`,
              value: `${dealerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${dealerValue}`,
              inline: true
            }
          )
          
      } else {
        // Joueur perd
        userData.cash -= betAmount;
        await userData.save();
    
        resultEmbed = new EmbedBuilder()
          .setColor("#ee2346")
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
          .setDescription(`Résultat : vous perdez **${betAmount}** <:IconCasinoChips:1008768785869713551>`)
          .addFields(
            {
              name: `Votre main`,
              value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
              inline: true
            },
            {
              name: `Main du croupier`,
              value: `${dealerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${dealerValue}`,
              inline: true
            }
          )
      }
    
      await i.update({ embeds: [resultEmbed], components: [] });
      collector.stop();
    };

    collector.on('collect', async i => {
      if (i.customId === 'hit') {
        const newCard = getRandomCard();
        playerHand.push(newCard);
        playerValue = calculateHandValue(playerHand);

        if (playerValue === 21) {
          // Si le joueur atteint 21, c'est le tour du croupier
          await dealerTurn(i);
        } else if (playerValue > 21) {
          // Joueur a perdu
          userData.cash -= betAmount;
          await userData.save();

          const loseEmbed = new EmbedBuilder()
            .setColor("#ee2346")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
            .setDescription(`Résultat : vous perdez **${betAmount}** <:IconCasinoChips:1008768785869713551>`)
            .addFields(
              {
                name: `Votre main`,
                value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
                inline: true
              },
              {
                name: `Main du croupier`,
                value: `${dealerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${dealerValue}`,
                inline: true
              }
            )

          await i.update({ embeds: [loseEmbed], components: [] });
          collector.stop();
        } else {
          // Mise à jour de l'embed avec la nouvelle carte
          const updatedEmbed = new EmbedBuilder()
            .setColor("#5865f2")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
            .addFields(
              {
                name: `Votre main`,
                value: `${playerHand.map(card => cardEmojis[card.cardId]).join(' ')}\n\nTotal : ${playerValue}`,
                inline: true
              },
              {
                name: `Main du croupier`,
                value: `${cardEmojis[dealerHand[0].cardId]} <:cardBack:1273638977496289321> \n\nTotal : ${dealerHand[0].cardValue}`,
                inline: true
              }
            )


          await i.update({ embeds: [updatedEmbed], components: [row] });
        }
      } else if (i.customId === 'stand') {
        // Le joueur choisit de rester, c'est au tour du croupier
        await dealerTurn(i);
      }
    });
  }
};
