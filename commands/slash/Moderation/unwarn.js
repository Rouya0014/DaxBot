const {
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const warningSchema = require("../../../models/warning");

module.exports = {
  name: "unwarn",
  description: "🔨 | Retire un avertissement d'un membre.",
  type: 1,
  options: [
      {
          name: "utilisateur",
          description: "L'utilisateur dont vous souhaitez retirer un avertissement.",
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
      },
      {
          name: "warn_id",
          description: "ID de l'avertissement à retirer.",
          type: ApplicationCommandOptionType.String,
          required: true,
      },
  ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "MuteMembers",
  },
  category: "Moderation",

  run: async (client, interaction, config, db) => {
      const target = interaction.options.get("utilisateur");
      const warnId = interaction.options.get("warn_id").value;

      const embed = new EmbedBuilder();
      
      warningSchema.findOne({ guild: interaction.guild.id, user: target.user.id, moderationId: warnId }, async (err, data) => { 
          if (err) throw err;
      
          if (data) {
              await warningSchema.findOneAndDelete({
                  guild: interaction.guild.id,
                  moderationId: warnId,
              });
      
              embed.setAuthor({
                  name: `L'avertissement de ${target.user.username} a été retiré.`,
                  iconURL: `${target.user.displayAvatarURL({ size: 512, dynamic: true })}`,
              })
              .setColor('#278048');
      
              interaction.reply({ embeds: [embed] });
          } else {
              interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas d'avertissement avec cet ID.", ephemeral: true });
          }
      });
  },
};