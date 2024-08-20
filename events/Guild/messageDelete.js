const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "messageDelete"
};

client.on('messageDelete', message => {
    const logChannel = client.channels.cache.get('1008348408592990278');
    if (!logChannel) return;

    if (message.author && message.author.id === client.user.id) return;

    if (!message.author) return;

    // Définir la longueur maximale du contenu à afficher dans l'embed
    const maxLength = 1008;

    let content = message.content || "[Pas de contenu]";

    // Tronquer le contenu s'il dépasse la longueur maximale
    if (content.length > maxLength) {
        content = content.slice(0, maxLength - 3) + "...";
    }

    const embed = new EmbedBuilder()
        .setColor('#e94349')
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
        .setDescription(`**<:LogThreadMinusIcon:1088933178921717860> Le message de ${message.author} a été supprimé.**`)
        .setTimestamp()
        .addFields(
            { name: 'Salon', value: `> <#${message.channel.id}>`, inline: true },
            { name: 'ID du salon', value: `> ${message.channel.id}`, inline: true },
            { name: '\u200b', value: '\u200b', inline: true },
            { name: 'ID du message', value: `> ${message.id}`, inline: true },
            { name: 'ID de l\'auteur', value: `> ${message.author.id}`, inline: true },
            { name: '\u200b', value: '\u200b', inline: true },
            { name: 'Contenu', value: `\`\`\`${content}\`\`\`` },
        );

    logChannel.send({ embeds: [embed] });
});