const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "automod_mot_signale",
  description: "🛠️ | Met en place le système d'auto-modération pour les mots signalés.",
  type: 1, // Commande slash
  options: [
    {
      name: "action",
      description: "Choisissez d'activer ou de désactiver le système d'auto-modération.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Activer", value: "enable" },
        { name: "Désactiver", value: "disable" },
      ],
    },
    {
      name: "channel",
      description: "Le salon où les alertes seront envoyées (obligatoire si vous activez le système).",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
  },
  category: "Info",

  run: async (client, interaction, config, db) => {
    const action = interaction.options.getString("action");
    const alertChannel = interaction.options.getChannel("channel");

    await interaction.reply({
      content: `Chargement des règles d'auto-modération...`,
    });

    try {
      // Récupérer les règles d'auto-modération existantes
      const rules = await interaction.guild.autoModerationRules.fetch();

      // Rechercher une règle avec le même nom
      const existingRule = rules.find(rule => rule.name === "Dax bloquera les grossièretés, contenu sexuel et insultes.");

      if (action === "enable") {
        if (existingRule) {
          await interaction.editReply({
            content: `Une règle d'auto-modération pour les mots signalés existe déjà.`,
          });
          return;
        }

        if (!alertChannel) {
          await interaction.editReply({
            content: "Le salon pour les alertes est requis pour activer le système.",
          });
          return;
        }

        // Créer la règle si elle n'existe pas encore
        const rule = await interaction.guild.autoModerationRules.create({
          name: `Dax bloquera les grossièretés, contenu sexuel et insultes.`,
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata: {
            presets: [1, 2, 3],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                durationSeconds: 10,
                customMessage: `Ce message a été empêché par la modération automatique de Dax.`,
              },
            },
            {
              type: 2,
              metadata: {
                channel: alertChannel.id,
              },
            },
          ],
        });

        const embed = new EmbedBuilder()
          .setColor("#278048")
          .setDescription(
            `Votre règle d'auto-modération a bien été créée. Les mots signalés seront bloqués par Dax. Les alertes seront envoyées dans ${alertChannel}.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      } else if (action === "disable") {
        if (!existingRule) {
          await interaction.editReply({
            content: `Aucune règle d'auto-modération pour les mots signalés n'a été trouvée.`,
          });
          return;
        }

        // Supprimer la règle si elle existe
        await existingRule.delete();

        const embed = new EmbedBuilder()
          .setColor("#ee2346")
          .setDescription(
            `La règle d'auto-modération pour les mots signalés a été désactivée.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      await interaction.followUp({ content: `Erreur : ${err.message}` });
    }
  },
};