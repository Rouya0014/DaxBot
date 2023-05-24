const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "suggestion",
  run: async (client, interaction, config, db) => {
    const suggestchannel = interaction.guild.channels.cache.get("1066483730224529458");

    try {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Suggestion de ${interaction.member.user.tag}`, iconURL: `${interaction.member.user.displayAvatarURL({ size: 512, dynamic: true })}`})
        .setTitle(interaction.fields.getTextInputValue("titre"))
        .setDescription(interaction.fields.getTextInputValue("description"))
        .setColor("5865f2")
        .setTimestamp();
    
        await suggestchannel.send({ embeds: [embed] }).then(int => {
            int.react("<:Pour:1066483148931739698>").then(() => {
                int.react("<:Neutre:1066483158004027413>").then(() => {
                    int.react("<:Contre:1066483169643204718>")
                });
            });
        });
        await interaction.reply({ content: "Votre suggestion a été envoyée avec succès.", ephemeral: true });
    } catch(error) {
        console.error(error);
        await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de l'envoi de votre suggestion. Veuillez réessayer plus tard.", ephemeral: true });
    }
  },
};
