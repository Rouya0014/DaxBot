const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const casinoSchema = require('../../../models/casino');

module.exports = {
  name: 'craps',
  description: '🎲 | Jouez au Craps.',
  type: 1,
  options: [
    {
      name: 'montant',
      description: 'Le montant de jetons que vous souhaitez parier',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  category: 'Games',
  run: async (client, interaction) => {
    const betAmount = interaction.options.getInteger('montant');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
 
    const maxBet = 20000; // Limite de mise

    // Vérification de la mise
    if (betAmount <= 0) {
      return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le montant doit être supérieur à 0 <:IconCasinoChips:1008768785869713551>', ephemeral: true });
    }

    if (betAmount > maxBet) {
      return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Le montant ne peut pas dépasser ${maxBet} <:IconCasinoChips:1008768785869713551>`, ephemeral: true });
    }

    // Récupérer les données de l'utilisateur
    let userData = await casinoSchema.findOne({ userId, guildId });

    // Si l'utilisateur n'existe pas encore dans la base de données, on peut le créer
    if (!userData) {
      userData = new casinoSchema({
        userId,
        guildId,
        cash: 10000, // Valeur initiale si l'utilisateur est nouveau
        bank: 0,
      });
      await userData.save();
    }

    // Vérification que l'utilisateur a suffisamment de liquidités
    if (userData.cash < betAmount) {
      return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas assez de jetons en liquide pour faire ce pari.", ephemeral: true });
    }

    // Début du jeu de Craps
    startCrapsGame(interaction, betAmount, userData);
  },
};

async function startCrapsGame(interaction, betAmount, userData) {
  const comeOutRoll = rollDice();

  let embed = new EmbedBuilder()
    .setColor('#5865f2') // Couleur par défaut pour le Come-Out Roll
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
    .setDescription(`Vous avez lancé **${comeOutRoll}**.`);

  if (comeOutRoll === 7 || comeOutRoll === 11) {
    userData.cash += betAmount;
    embed.setColor('#278048')
    .setDescription(`Résultat : vous remportez ${betAmount} <:IconCasinoChips:1008768785869713551>`)
    .addFields(
      {name: `**Naturel !** Vous avez lancé :`, value: `${comeOutRoll}`}
    ) 
  } else if (comeOutRoll === 2 || comeOutRoll === 3 || comeOutRoll === 12) {
    userData.cash -= betAmount;
    embed.setColor('#ee2346') // Rouge pour la perte
         .setDescription(`Résultat : vous perdez ${betAmount} <:IconCasinoChips:1008768785869713551>`)
         .addFields(
          {name: `**Craps !** Vous avez lancé :`, value: `${comeOutRoll}`}
        ) 
  } else {
    embed.setColor('#F8C300') // Jaune pour la phase de point
         .setDescription(`Le point est établi à **${comeOutRoll}**. Appuyez sur le bouton pour relancer les dés !`)
         .addFields(
           { name: 'Point Actuel', value: `${comeOutRoll}`, inline: true },
           { name: 'Pour Gagner', value: `Refaites le point de ${comeOutRoll} avant de lancer un **7**.`, inline: true }
         );
    interaction.reply({ embeds: [embed], components: [createRollButton()] });

    // Passer à la phase du point
    handlePointPhase(interaction, betAmount, userData, comeOutRoll);
    return; // Exit to prevent duplicate replies
  }

  await userData.save(); // Sauvegarder les changements dans la base de données

  return interaction.reply({ embeds: [embed] });
}

function createRollButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('roll_again')
      .setLabel('Relancer les dés')
      .setStyle(ButtonStyle.Primary)
  );
}

async function handlePointPhase(interaction, betAmount, userData, point) {
  const filter = i => i.customId === 'roll_again' && i.user.id === interaction.user.id;

  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    const roll = rollDice();
    let embed = new EmbedBuilder()
      .setColor('#F8C300') // Jaune pour la phase de point
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
      .setDescription(`Vous avez lancé ${roll}.`)
      .addFields(
        { name: 'Point Actuel', value: `${roll}`, inline: true },
        { name: 'Point à Refaire', value: `${point}`, inline: true }
      );

    if (roll === point) {
      userData.cash += betAmount;
      embed.setColor('#278048')
           .setDescription(`Résultat : vous remportez ${betAmount} <:IconCasinoChips:1008768785869713551>`)
           .addFields(
            {
              name: `Vous avez refait le point`, value: `${roll}`
            }
           )
      await i.update({ embeds: [embed], components: [] });
      collector.stop('won');
    } else if (roll === 7) {
      userData.cash -= betAmount;
      embed.setColor('#ee2346') // Rouge pour la perte
           .setDescription(`Résultat : vous perdez **${betAmount}** <:IconCasinoChips:1008768785869713551>`)
           .setFooter({text: `Vous avez lancé 7 avant de refaire le point.`})
      await i.update({ embeds: [embed], components: [] });
      collector.stop('lost');
    } else {
      await i.update({ embeds: [embed], components: [createRollButton()] });
    }

    await userData.save(); // Sauvegarder les changements dans la base de données après chaque lancer
  });

}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
}