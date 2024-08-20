const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "automod_spams_de_message",
  description: "🛠️ | Met en place le système d'auto-modération pour le spam de messages.",
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
      required: false, // Non requis lors de la désactivation
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
      const existingRule = rules.find(rule => rule.name === "Dax empêchera le spam de messages.");

      if (action === "enable") {
        if (existingRule) {
          await interaction.editReply({
            content: `<:ErrorIcon:1098685738268229754> Une règle d'auto-modération pour le spam de messages existe déjà.`, ephemeral: true
          });
          return;
        }

        if (!alertChannel) {
          await interaction.editReply({ content: "<:ErrorIcon:1098685738268229754> Le salon pour les alertes est requis pour activer le système.", ephemeral: true });
          return;
        }

        // Créer la règle si elle n'existe pas encore
        const rule = await interaction.guild.autoModerationRules.create({
          name: `Dax empêchera le spam de messages.`,
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 3,
          triggerMetadata: {},
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
            `Votre règle d'auto-modération a bien été créée. Les spams de messages seront bloqués par Dax. Les alertes seront envoyées dans ${alertChannel}.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      } else if (action === "disable") {
        if (!existingRule) {
          await interaction.editReply({
            content: `Aucune règle d'auto-modération pour le spam de messages n'a été trouvée.`,
          });
          return;
        }

        // Supprimer la règle si elle existe
        await existingRule.delete();

        const embed = new EmbedBuilder()
          .setColor("#ee2346")
          .setDescription(
            `La règle d'auto-modération pour le spam de messages a été désactivée.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      await interaction.followUp({ content: `Erreur : ${err.message}` });
    }
  },
};