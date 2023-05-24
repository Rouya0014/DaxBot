const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "guildMemberUpdate",
};

client.on("guildMemberUpdate", (oldMember, newMember) => {
  const logChannel = client.channels.cache.get("1008348408592990278");
  if (!logChannel) return;

  if (oldMember.displayName !== newMember.displayName) {
    const embed = new EmbedBuilder()
    .setTimestamp()
    .setColor("f6a72d")
    .setAuthor({name: `${oldMember.user.tag}`, iconURL: oldMember.displayAvatarURL({size: 1024,dynamic: true})})
    .setThumbnail(oldMember.displayAvatarURL({size: 1024,dynamic: true}))
    .setDescription(`<:LogMemberUpdateIcon:1088934545023316140> ${oldMember} surnom édité`)
    .setFooter({text: `ID du membre : ${oldMember.id}`})
    .addFields(
      {name: "Ancien surnom", value: `> \`\`\`${oldMember.displayName}\`\`\``, inline: true},
      {name: "Nouveau surnom", value: `> \`\`\`${newMember.displayName}\`\`\``, inline: true},
    )
    logChannel.send({embeds: [embed]})
  }
});
