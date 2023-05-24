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
              name: "user",
              description:
                "L'utilisateur dont vous voulez retirer tous les avertissements.",
              type: ApplicationCommandOptionType.Mentionable,
              required: true,
            },
            {
              name: "warn_id",
              description: "Warn ID to remove.",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
    ],
    permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "MuteMembers",
    },
    category: "Moderation",
  
    run: async (client, interaction, config, db) => {
        const target = interaction.options.get("user");
        let warnId = interaction.options.get("warn_id").value;
     
        const embed = new EmbedBuilder();
        
        warningSchema.findOne({ guild: interaction.guild.id, user: target.user.id, moderationId: warnId }, async (err, data) => { 
          if (err) throw err;
        
          if (data) {

            await warningSchema.findOneAndDelete({
              guild: interaction.guild.id,
              moderationId: warnId,
            })
        
            embed.setAuthor({name: `L'infraction de ${target.user.tag} a été retirée.` , iconURL: `${target.user.displayAvatarURL({size: 512, dynamic: true})}`})
            .setColor('#278048');
        
            interaction.reply({embeds: [embed]});
          } else {
            interaction.reply({content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'a pas d'infraction", ephemeral: true})
          }
        });
    },
  };
