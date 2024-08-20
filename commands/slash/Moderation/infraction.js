const {
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const warningModel = require("../../../models/warning");

module.exports = {
  name: "infractions",
  description: "🔨 | Affiche toutes les infractions d'un membre.",
  type: 1,
  options: [
      {
          name: "user",
          description: "L'utilisateur pour lequel afficher les infractions.",
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
      },
  ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "MuteMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
      const target = interaction.options.get("user");

      const embed = new EmbedBuilder()
          .setAuthor({
              name: `Infractions de ${target.user.username}`,
              iconURL: `${target.user.displayAvatarURL({ size: 512, dynamic: true })}`,
          })
          .setColor("#fc964c");

      const warnings = await warningModel.find({
          guild: interaction.guild.id,
          user: target.user.id,
      });

      if (warnings.length === 0) {
          interaction.reply({
              content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas d'infractions.",
              ephemeral: true,
          });
          return;
      }

      const fields = warnings.map((warning) => ({
          name: `Infraction : ${warning.moderationId}`,
          value: `> **Raison :** ${warning.reason}\n> **Modérateur :** <@${warning.mod}>`,
          inline: false,
      }));

      embed.addFields(fields);

      interaction.reply({ embeds: [embed] });
  },
};