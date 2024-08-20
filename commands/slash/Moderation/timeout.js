const { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "timeout",
    description: "🔨 | Exclure un membre.",
    type: 1,
    options: [
        {
            name: 'utilisateur',
            description: 'L\'utilisateur que vous souhaitez exclure.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'durée',
            description: 'Durée de l\'exclusion (30m, 1h, 1j).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'raison',
            description: 'La raison de l\'exclusion.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "MuteMembers"
    },
    category: "Moderation",
    
    run: async (client, interaction, config, db) => {
        const mentionable = interaction.options.get('utilisateur').value;
        const duration = interaction.options.get('durée').value; // 1d, 1 day, 1s, 5s, 5m
        const reason = interaction.options.get('raison')?.value || 'Aucune raison fournie';
    
        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Cet utilisateur n'est pas sur ce serveur.", ephemeral: true });
            return;
        }
    
        if (targetUser.user.bot) {
            await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Je ne peux pas exclure un bot.", ephemeral: true });
            return;
        }
    
        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Veuillez fournir une durée d\'exclusion valide.', ephemeral: true });
            return;
        }
    
        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.reply({ content: '<:ErrorIcon:1098685738268229754> La durée d\'exclusion ne peut pas être inférieure à 5 secondes ni supérieure à 28 jours.', ephemeral: true });
            return;
        }
    
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
    
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Vous ne pouvez pas exclure cet utilisateur car il a le même rôle/plus haut que vous.", ephemeral: true });
            return;
        }
    
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Je ne peux pas exclure cet utilisateur car il a le même rôle/plus haut que moi.", ephemeral: true });
            return;
        }
  
        const { default: prettyMs } = await import('pretty-ms');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Arrêter l\'exclusion')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(cancel);
    
        if (targetUser.isCommunicationDisabled()) {
            await interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Je ne peux pas exclure cet utilisateur car il est déjà exclu.", ephemeral: true });
            return;
        }
    
        await targetUser.timeout(msDuration, reason);

        let durationInWords = prettyMs(msDuration, { verbose: true });
        durationInWords = durationInWords.replace('days', 'jours')
            .replace('day', 'jour')
            .replace('hours', 'heures')
            .replace('hour', 'heure')
            .replace('minutes', 'minutes')
            .replace('minute', 'minute')
            .replace('seconds', 'secondes')
            .replace('second', 'seconde');

        const timeoutEmbed = new EmbedBuilder()
            .setAuthor({ name: `${targetUser.user.username} a été exclu pendant ${durationInWords}`, iconURL: targetUser.displayAvatarURL({ size: 512, dynamic: true }) })
            .setDescription(`<:TimeoutIcon:1266841132655185970> **Raison** : ${reason}`)
            .setColor('#ee2346');

        await interaction.reply({ embeds: [timeoutEmbed], components: [row] });

        const logChannel = client.channels.cache.get("1008348408592990278");
        if (!logChannel) return;
        
        const logTimeoutEmbed = new EmbedBuilder()
            .setAuthor({ name: `${targetUser.user.username}`, iconURL: targetUser.displayAvatarURL({ size: 512, dynamic: true }) })
            .setThumbnail(targetUser.displayAvatarURL({ size: 512, dynamic: true }))
            .setDescription(`<:LogMemberMinusIcon:1088934374625509396> ${targetUser} a été exclu pendant ${durationInWords}`)
            .setColor('#e94349')
            .setTimestamp()
            .setFooter({ text: `ID du membre : ${targetUser.id}` });

        await logChannel.send({ embeds: [logTimeoutEmbed] });

        client.on("interactionCreate", async interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId === "cancel") {
                const target = interaction.member;
                const canMute = target.permissions.has(PermissionsBitField.Flags.MuteMembers);

                if (!canMute) {
                    try {
                        await interaction.reply({
                            content: `<:ErrorIcon:1098685738268229754> Vous n'avez pas la permission d'utiliser cette commande !`,
                            ephemeral: true
                        });
                    } catch (error) {
                        if (error.code === 10062) {
                            return;
                        } else {
                            console.error(error);
                        }
                    }
                    return;
                }
          
                if (!targetUser.isCommunicationDisabled()) {
                    return interaction.reply({
                        content: `<:ErrorIcon:1098685738268229754> L'utilisateur **${targetUser.user.username}** n'est pas exclu.`,
                        ephemeral: true
                    });
                }

                await targetUser.timeout(null);
                const untimeout = new EmbedBuilder()
                    .setAuthor({ name: `${targetUser.user.username} n'est plus exclu`, iconURL: targetUser.displayAvatarURL({ size: 512, dynamic: true }) })
                    .setColor('#278048');

                interaction.deferUpdate().then(() => {
                    interaction.editReply({
                        embeds: [untimeout],
                        components: []
                    });

                    const logUntimeoutEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${targetUser.user.username}`, iconURL: targetUser.displayAvatarURL({ size: 512, dynamic: true }) })
                        .setThumbnail(targetUser.displayAvatarURL({ size: 512, dynamic: true }))
                        .setDescription(`<:LogMemberPlusIcon:1088934706889887846> ${targetUser} n'est plus exclu`)
                        .setColor('#43a662')
                        .setTimestamp()
                        .setFooter({ text: `ID du membre : ${targetUser.id}` });

                    logChannel.send({ embeds: [logUntimeoutEmbed] });
                }).catch(console.error);
            }
        });
    },
};