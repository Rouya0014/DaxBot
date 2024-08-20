const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField 
} = require("discord.js");

module.exports = {
  name: "unban",
  description: "🔨 | Débannir un membre.",
  type: 1,
  options: [
    {
      name: "utilisateur",
      description: "L'utilisateur que vous voulez débannir (mettre une ID).",
      type: ApplicationCommandOptionType.String, // Utiliser String pour l'ID du membre
      required: true,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "BanMembers",
  },
  category: "Moderation",
  
  run: async (client, interaction, config, db) => {
    const targetUserid = interaction.options.get("utilisateur").value;
    
    if (!targetUserid) {
      return interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> Veuillez fournir une ID valide.",
        ephemeral: true,
      });
    }

    let targetUser;
    try {
      targetUser = await interaction.guild.bans.fetch(targetUserid);
    } catch (error) {
      return interaction.reply({
        content: "<:ErrorIcon:1098685738268229754> L'utilisateur n'est pas banni ou l'ID est incorrecte.",
        ephemeral: true,
      });
    }

    const unban = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.user.tag} a été débanni avec succès.`,
        iconURL: `${targetUser.user.displayAvatarURL({ size: 512, dynamic: true })}`,
      })
      .setColor("#278048");

    await interaction.reply({ embeds: [unban] });
    await interaction.guild.bans.remove(targetUserid);
  },
};