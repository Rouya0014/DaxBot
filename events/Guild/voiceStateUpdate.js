const client = require("../../index");
const { ChannelType, GuildVoice, PermissionsBitField, Collection } = require('discord.js')
const schema = require('../../models/Join-To-Create')
client.voicetemp = new Collection()

module.exports = {
    name: "jointocreate"
};

client.on("voiceStateUpdate", async (oldState, newState) => {
    const { EmbedBuilder } = require("discord.js");
    const embed = new EmbedBuilder()
    .setAuthor({name: oldState.member.user.tag, iconURL: oldState.member.user.avatarURL()})

    const logChannel = client.channels.cache.get('1008348408592990278');
    if (!logChannel) return;
  
    if (oldState.channelId && !newState.channelId) { // Utilisateur déconnecté du canal vocal
        logChannel.send({embeds: [embed.setDescription(`**<:LogVoiceMinusIcon:1102897024229179424> ${oldState.member.user} a quitté le canal vocal \`${oldState.channel.name}\`**.`).setColor("e94349")]});
    } else if (!oldState.channelId && newState.channelId) { // Utilisateur connecté au canal vocal
        logChannel.send({embeds: [embed.setDescription(`**<:LogVoicePlusIcon:1102897015517630475> ${newState.member.user} a rejoint le canal vocal \`${newState.channel.name}\`**.`).setColor("43a662")]});
    } else if (oldState.channelId !== newState.channelId) { // Utilisateur a changé de canal vocal
        logChannel.send({embeds: [embed.setDescription(`**<:LogVoiceUpdateIcon:1102898639363383337> ${newState.member.user} a changé de canal vocal de \`${oldState.channel.name}\` à \`${newState.channel.name}\`.**`).setColor("f6a72d")]});
    }

    
    const data = await schema.findOne({ Guild: oldState.guild.id || newState.guild.id })

    if (!data) return;

    if(newState?.channel == data?.channel) {
        const { guild, user, voice, id } = newState.member;

        const parent = newState.channel?.parentId;
        const parentId = parent? {
            parent,
        } : {

        }

        const voicechannel = await guild.channels.create({
            name: `🔊・Vocal de ${user.username}`,
            type: ChannelType.GuildVoice,
            ...parentId,
            permissionOverwrites: [
                {
                    id: id,
                    allow: [
                        PermissionsBitField.Flags.Speak,
                        PermissionsBitField.Flags.Stream,
                        PermissionsBitField.Flags.ManageChannels
                    ]
                },
                {
                    id: guild.id,
                    allow: [
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak,
                        PermissionsBitField.Flags.Stream,
                    ]
                },
            ],
        });

        client.voicetemp.set(voicechannel.id, newState.member);
        voice.setChannel(voicechannel.id)
    }

    if (
        client.voicetemp.get(oldState.channelId) &&
        oldState.channel.members.size == 0
    )

    return oldState.channel.delete().catch(() => {})
})