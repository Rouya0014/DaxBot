const { EmbedBuilder, ButtonInteraction, PermissionFlagsBits} = require('discord.js')
const client = require("../../index");
const {createTranscript} = require("discord-html-transcripts")
const { transcripts } = require("../../config.json")
const ticketSchema = require('../../models/Ticket')

module.exports = {
    name: "interactionCreate"
}

client.on('interactionCreate', async (interaction) => {
        const { guild, member, customId, channel } = interaction
        const { SendMessages, BanMembers, ManageChannels } = PermissionFlagsBits;

        if(!interaction.isButton()) return;

        if(!["close", "lock", "unlock", "claim"].includes(customId)) return;

        if(!guild.members.me.permissions.has(ManageChannels))
            return interaction.reply('error')

        const embed = new EmbedBuilder()

        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if(!data) return;

            const fetchedMember = await guild.members.cache.get(data.MembersID);            
            try {
            switch (customId) {
                case "close":
                    if (data.closed == true)
                        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Le ticket est déjà en train d'être supprimé...", ephemeral: true});

                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                    });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });


                    const transcripProcess = new EmbedBuilder()
                        .setTitle(`Enregistrement de la transcription`)
                        .setDescription("Le ticket sera fermé dans 10 secondes, activez les DM pour la transcription du ticket.")
                        .setColor("ee2346")
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true})})
                        .setTimestamp()

                        const res = await guild.channels.cache.get(transcripts).send({
                            files: [transcript],
                        });
                        setTimeout(function () {
                            res.delete();
                        }, 1000);

                    const transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Sujet: ${data.Type}\nID: ${data.TicketID}`)
                    .setDescription(`[Télécharger la transcription du ticket](${res.attachments.first().url})`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true})})
                    .setColor('5865f2')
                    .setTimestamp();

                    await guild.channels.cache.get(transcripts).send({
                        embeds: [transcriptEmbed],
                    });

                    channel.send({embeds : [transcripProcess] });

                    setTimeout(function () {
                        member.send({
                            embeds: [transcriptEmbed.setDescription(`Accédez à la transcription de votre billet : [ici](${res.attachments.first().url})`)]
                        }).catch(() => channel.send('<:ErrorIcon:1098685738268229754> Impossible d\'envoyer la transcription aux messages privés.'));
                        channel.delete();
                    }, 10000)

                    break;
                    case "lock":
                        
                        if (!member.permissions.has(BanMembers))
                            return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission pour cela.", ephemeral: true});
   
                        let LockData = await ticketSchema.findOneAndUpdate(
                            { ChannelID: channel.id },
                            { Locked: true },
                        );

                        if (LockData.Locked == true) {
                            interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Le ticket est déjà verrouillé !", ephemeral: true})
                            if (err.code === 10062) return; 
                        }
                        embed.setDescription("Le ticket a été verrouillé avec succès 🔒").setColor("ee2346");

                        data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: false });
                        })

                        return interaction.reply({ embeds: [embed] });

                    case "unlock":
                        if (!member.permissions.has(BanMembers))
                            return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission pour cela.", ephemeral: true});
                        
                        let UnlockData = await ticketSchema.findOneAndUpdate(
                            { ChannelID: channel.id },
                            { Locked: false },
                        );
                        if (UnlockData.Locked == false) {
                             interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Le ticket est déjà déverrouillé !", ephemeral: true})
                             if (err.code === 10062) return; 
                        }
                        embed.setDescription("Le ticket a été déverrouillé avec succès 🔒").setColor("278048");

                        data.MembersID.forEach((m) => {
                            channel.permissionOverwrites.edit(m, { SendMessages: true });
                        })

                        return interaction.reply({ embeds: [embed] });
                   

                    case "claim":
                        if (!member.permissions.has(BanMembers))
                            return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission pour cela.", ephemeral: true});
                      
                            let ClaimData = await ticketSchema.findOneAndUpdate(
                                { ChannelID: channel.id },
                                { Claimed: true },
                            );

                        if (ClaimData.Claimed == true) {
                            interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Le ticket a déjà était pris en charge" , ephemeral: true})
                            if (err.code === 10062) return; 
                        }
                       
                        embed.setDescription("Le ticket est pris en charge par <@" + member + ">").setColor("5865f2");
    
                        channel.permissionOverwrites.edit(fetchedMember, { SendMessages: true });
    
                        return interaction.reply({ embeds: [embed] });
                }
            } catch (err) {
                return console.log(err)
            }
        });
    })