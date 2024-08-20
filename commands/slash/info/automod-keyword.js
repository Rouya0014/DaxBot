const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "automod_mot_cle",
  description: "🛠️ | Met en place le système d'auto-modération pour les mots-clés.",
  type: 1, // Commande slash
  options: [
    {
      name: "action",
      description: "Choisissez d'activer, désactiver ou ajouter un mot-clé au système d'auto-modération.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Activer", value: "enable" },
        { name: "Ajouter un mot-clé", value: "add" },
        { name: "Désactiver", value: "disable" },
      ],
    },
    {
      name: "mot-cle",
      description: "Mot-clé à bloquer ou ajouter (obligatoire pour l'activation et l'ajout).",
      type: ApplicationCommandOptionType.String,
      required: false,
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
    const keyword = interaction.options.getString("mot-cle");
    const alertChannel = interaction.options.getChannel("channel");

    await interaction.reply({
      content: "Chargement des règles d'auto-modération...",
    });

    try {
      // Récupérer les règles d'auto-modération existantes
      const rules = await interaction.guild.autoModerationRules.fetch();

      // Rechercher une règle avec le même nom
      const existingRule = rules.find(rule => rule.name === "Dax bloquera le mot clé.");

      if (action === "enable") {
        if (existingRule) {
          await interaction.editReply({
            content: "Une règle d'auto-modération pour le mot-clé existe déjà.",
          });
          return;
        }

        if (!keyword || !alertChannel) {
          await interaction.editReply({
            content: "Le mot-clé et le salon pour les alertes sont requis pour activer le système.",
          });
          return;
        }

        // Créer la règle si elle n'existe pas encore
        const rule = await interaction.guild.autoModerationRules.create({
          name: "Dax bloquera le mot clé.",
          creatorId: interaction.user.id,
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata: {
            keywordFilter: [keyword],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel.id,
                durationSeconds: 10,
                customMessage: "Ce message a été empêché par la modération automatique de Dax.",
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
          .setColor("Blurple")
          .setDescription(
            `Votre règle d'auto-modération a bien été créée. Les messages contenant le mot "${keyword}" seront bloqués par Dax. Les alertes seront envoyées dans ${alertChannel}.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      } else if (action === "add") {
        if (!existingRule) {
          await interaction.editReply({
            content: "Aucune règle d'auto-modération existante pour les mots-clés n'a été trouvée. Utilisez l'option \"Activer\" pour créer une nouvelle règle.",
          });
          return;
        }

        if (!keyword) {
          await interaction.editReply({
            content: "Vous devez spécifier un mot-clé pour l'ajouter à la règle existante.",
          });
          return;
        }

        // Ajouter le nouveau mot-clé à la liste existante
        const updatedKeywords = [...existingRule.triggerMetadata.keywordFilter, keyword];

        // Mettre à jour la règle existante avec la nouvelle liste de mots-clés
        await existingRule.edit({
          triggerMetadata: {
            keywordFilter: updatedKeywords,
          },
        });

        const embed = new EmbedBuilder()
          .setColor("#278048")
          .setDescription(
            `Le mot "${keyword}" a été ajouté à la règle d'auto-modération existante.`
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      } else if (action === "disable") {
        if (!existingRule) {
          await interaction.editReply({
            content: "Aucune règle d'auto-modération pour les mots-clés n'a été trouvée.",
          });
          return;
        }

        // Supprimer la règle si elle existe
        await existingRule.delete();

        const embed = new EmbedBuilder()
          .setColor("#ee2346")
          .setDescription(
            "La règle d'auto-modération pour les mots-clés a été désactivée."
          );
        await interaction.editReply({ content: "", embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      await interaction.followUp({ content: `Erreur : ${err.message}` });
    }
  },
};