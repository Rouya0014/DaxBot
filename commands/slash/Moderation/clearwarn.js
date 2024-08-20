const {
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const warningSchema = require("../../../models/warning");

module.exports = {
  name: "clear-all-warn",
  description: "🔨 | Retire tous les avertissements d'un membre.",
  type: 1,
  options: [
      {
          name: "user",
          description: "L'utilisateur dont vous voulez retirer tous les avertissements.",
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

      const embed = new EmbedBuilder();
      
      warningSchema.findOne({ guild: interaction.guild.id, user: target.user.id }, async (err, data) => {
          if (err) throw err;

          if (data) {
              await warningSchema.deleteMany({
                  guild: interaction.guild.id,
                  user: target.user.id
              });

              embed.setAuthor({ name: `Les avertissements de ${target.user.username} ont été retirés.`, iconURL: `${target.user.displayAvatarURL({ size: 512, dynamic: true })}` })
                  .setColor('#278048');

              interaction.reply({ embeds: [embed] });
          } else {
              interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas d'avertissements.", ephemeral: true });
          }
      });
  },
};