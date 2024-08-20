const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const Giveaway = require('../../../models/giveaway'); // Assure-toi que ce chemin est correct

module.exports = {
    name: "giveaway",
    description: "Gère les giveaways",
    type: 1, // Command type 1 corresponds to a slash command
    options: [
        {
            name: 'créer',
            description: 'Crée un nouveau giveaway',
            type: 1, // Subcommand type
            options: [
                {
                    name: 'salon',
                    description: 'Salon où le giveaway sera annoncé',
                    type: 7, // Type 7 corresponds to a channel
                    required: true,
                },
                {
                    name: 'durée',
                    description: 'Durée du giveaway en minutes',
                    type: 4, // Type 4 corresponds to an integer
                    required: true,
                },
                {
                    name: 'prix',
                    description: 'Prix du giveaway',
                    type: 3, // Type 3 corresponds to a string
                    required: true,
                },
                {
                    name: 'gagnants',
                    description: 'Nombre de gagnants pour le giveaway',
                    type: 4, // Type 4 corresponds to an integer
                    required: true,
                },
            ],
        },
        {
            name: 'reroll',
            description: 'Refait un tirage au sort pour un giveaway',
            type: 1, // Subcommand type
            options: [
                {
                    name: 'message',
                    description: 'ID du message du giveaway',
                    type: 3, // Type 3 corresponds to a string
                    required: true,
                },
            ],
        },
        {
            name: 'pause',
            description: 'Met le giveaway en pause',
            type: 1, // Subcommand type
            options: [
                {
                    name: 'message',
                    description: 'ID du message du giveaway à mettre en pause',
                    type: 3, // Type 3 corresponds to a string
                    required: true,
                },
            ],
        },
        {
            name: 'reprendre',
            description: 'Reprend un giveaway mis en pause',
            type: 1, // Subcommand type
            options: [
                {
                    name: 'message',
                    description: 'ID du message du giveaway à reprendre',
                    type: 3, // Type 3 corresponds to a string
                    required: true,
                },
            ],
        },
        {
            name: 'finir',
            description: 'Termine un giveaway',
            type: 1, // Subcommand type
            options: [
                {
                    name: 'message',
                    description: 'ID du message du giveaway à terminer',
                    type: 3, // Type 3 corresponds to a string
                    required: true,
                },
            ],
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
    },
    category: "Info",
    run: async (client, interaction, config, db) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'créer') {
            // Logique pour créer un nouveau giveaway
            const salon = interaction.options.getChannel('salon');
            const durée = interaction.options.getInteger('durée');
            const prix = interaction.options.getString('prix');
            const gagnants = interaction.options.getInteger('gagnants');

            const endTime = Date.now() + durée * 60 * 1000;

            const giveawayEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${prix}`)
                .setDescription(`Cliquez sur le bouton <:8569awards:1236289961922138214> ci-dessous pour participer !\n\n<:DateTimeIcon:1184957483425484872> **Temps restant**: <t:${Math.floor(endTime / 1000)}:R>`)
                .addFields(
                    {name: `<:SoundbarIcon:1182434174100066324> Nombre de Participants`, value : `0`, inline: true},
                    {name: `<:TheBestServerEmojisIcon:1184958401906753556> ${gagnants.length > 1 ? 'Gagnants' : 'Gagnant'} :`, value : `${gagnants}`, inline: true},
                )
                .setColor('Random')
                .setTimestamp(endTime);

            const button = new ButtonBuilder()
                .setCustomId('giveaway_participation')
                .setEmoji('<:8569awards:1236289961922138214>')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(button);

            const giveawayMessage = await salon.send({ embeds: [giveawayEmbed], components: [row] });

            const newGiveaway = new Giveaway({
                messageId: giveawayMessage.id,
                channelId: salon.id,
                guildId: interaction.guild.id,
                endTime: endTime,
                prize: prix,
                winners: gagnants,
                participants: [],
                ended: false,
                paused: false,
            });

            await newGiveaway.save();

            await interaction.reply({ content: `Giveaway créé avec succès dans ${salon}!`, ephemeral: true });

            setTimeout(async () => {
                const giveawayData = await Giveaway.findOne({ messageId: giveawayMessage.id });

                if (giveawayData && !giveawayData.ended) {
                    giveawayData.ended = true;

                    let winnerMentions;
                    if (giveawayData.participants.length === 0) {
                        winnerMentions = 'Personne n\'a participé au giveaway.';
                    } else {
                        const winners = giveawayData.participants.sort(() => Math.random() - 0.5).slice(0, giveawayData.winners);
                        winnerMentions = winners.map(w => `<@${w}>`).join(', ');
                    }

                    const updatedEmbed = new EmbedBuilder()
                        .setTitle(`🎉 ${giveawayData.prize}`)
                        .setDescription(`<:CompleteThePoll:1236289962815651841> Terminé le <t:${Math.floor(Date.now() / 1000)}:F>`)
                        .addFields(
                            { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${giveawayData.participants.length}`, inline: true },
                            { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${winnerMentions.length > 1 ? 'Gagnants' : 'Gagnant'}`, value: `${winnerMentions}`, inline: true },
                        )
                        .setColor('Random')
                        .setTimestamp();
                
                    try {
                        await giveawayMessage.edit({ embeds: [updatedEmbed], components: [] });
                    } catch (error) {
                        console.error('Error editing final embed:', error);
                    }

                    if (giveawayData.participants.length > 0) {
                        await giveawayMessage.reply(`Félicitations à ${winnerMentions}! Vous avez gagné **${giveawayData.prize}** !`);
                    } else {
                        await giveawayMessage.reply(`Malheureusement, personne n'a participé au giveaway.`);
                    }

                    await giveawayData.save();
                }
            }, durée * 60 * 1000);
        } else if (subcommand === 'reroll') {
            const messageId = interaction.options.getString('message');
            const giveawayData = await Giveaway.findOne({ messageId });
        
            if (!giveawayData) {
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Aucun giveaway trouvé avec l'ID de message ${messageId}.`, ephemeral: true });
            }
        
            if (!giveawayData.ended) {
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Ce giveaway n'est pas encore terminé. Vous ne pouvez pas reroll maintenant.`, ephemeral: true });
            }
        
            if (giveawayData.participants.length === 0) {
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Personne n'a participé au giveaway, donc un reroll est impossible.`, ephemeral: true });
            }
        
            // Tirer de nouveaux gagnants
            const newWinners = giveawayData.participants.sort(() => Math.random() - 0.5).slice(0, giveawayData.winners);
            const winnerMentions = newWinners.map(w => `<@${w}>`).join(', ');
        
            // Mettre à jour l'embed original du giveaway
            const updatedEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${giveawayData.prize}`)
                .setDescription(`<:CompleteThePoll:1236289962815651841> Terminé le <t:${Math.floor(Date.now() / 1000)}:F>`)
                .addFields(
                    { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${giveawayData.participants.length}`, inline: true },
                    { name: `<:TheBestServerEmojisIcon:1184958401906753556> Nouveau${newWinners.length > 1 ? 'x Gagnants' : ' Gagnant'}`, value: `${winnerMentions}`, inline: true },
                )
                .setColor('Random')
                .setTimestamp();
        
            try {
                const giveawayMessage = await interaction.channel.messages.fetch(messageId);
                await giveawayMessage.edit({ embeds: [updatedEmbed], components: [] });
                await interaction.reply({ content: `${newWinners.length > 1 ? 'Les nouveaux gagnants sont ' : 'Le nouveau gagnant est '} ${winnerMentions}.`});
            } catch (error) {
                console.error('Error during reroll:', error);
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Une erreur est survenue lors du reroll.`, ephemeral: true });
            }
        } else if (subcommand === 'finir') {

            const messageId = interaction.options.getString('message');
            const giveawayData = await Giveaway.findOne({ messageId });

            if (!giveawayData) {
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Aucun giveaway trouvé avec l'ID de message ${messageId}.`, ephemeral: true });
            }

            if (giveawayData.ended) {
                return interaction.reply({ content: `<:ErrorIcon:1098685738268229754> Le giveaway est déjà terminé.`, ephemeral: true });
            }

            giveawayData.ended = true;

            let winnerMentions;
            if (giveawayData.participants.length === 0) {
                winnerMentions = 'Personne n\'a participé au giveaway.';
            } else {
                const winners = giveawayData.participants.sort(() => Math.random() - 0.5).slice(0, giveawayData.winners);
                winnerMentions = winners.map(w => `<@${w}>`).join(', ');
            }

            const finalEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${giveawayData.prize}`)
                .setDescription(`<:CompleteThePoll:1236289962815651841> Terminé le <t:${Math.floor(Date.now() / 1000)}:F>`)
                .addFields(
                    { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${giveawayData.participants.length}`, inline: true },
                    { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${winnerMentions.length > 1 ? 'Gagnants' : 'Gagnant'}`, value: `${winnerMentions}`, inline: true },
                )
                .setColor('Random')
                .setTimestamp();

            try {
                const giveawayMessage = await interaction.channel.messages.fetch(messageId);
                await giveawayMessage.edit({ embeds: [finalEmbed], components: [] });
                await giveawayMessage.reply(`Félicitations à ${winnerMentions}! Vous avez gagné **${giveawayData.prize}** !`);
                await interaction.reply({ content: `Le giveaway a été terminé avec succès.`, ephemeral: true });
            } catch (error) {
                console.error('Error ending the giveaway:', error);
                return interaction.reply({ content: `Une erreur est survenue lors de la terminaison du giveaway.`, ephemeral: true });
            }

            await giveawayData.save();
        } else if (subcommand === 'pause') {
            const messageId = interaction.options.getString('message');
            const giveawayData = await Giveaway.findOne({ messageId });
        
            if (!giveawayData) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Aucun giveaway trouvé avec l\'ID de message ${messageId}.', ephemeral: true });
            }
        
            if (giveawayData.ended) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le giveaway est déjà terminé, vous ne pouvez pas le mettre en pause.', ephemeral: true });
            }
        
            if (giveawayData.paused) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le giveaway est déjà en pause.', ephemeral: true });
            }
        
            giveawayData.paused = true;
            giveawayData.pauseStartTime = Date.now();
        
            const updatedEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${giveawayData.prize} (En Pause)`)
                .setDescription(`<:WithoutaVoice:1184957547837399250> Ce giveaway est actuellement en pause.\n**Temps restant**: ${Math.floor((giveawayData.endTime - giveawayData.pauseStartTime) / 1000)} secondes`)
                .addFields(
                    { name: '<:SoundbarIcon:1182434174100066324> Nombre de participants', value: `${giveawayData.participants.length}`, inline: true },
                    { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${giveawayData.winners.length > 1 ? 'Gagnants' : 'Gagnant'}`, value: `${giveawayData.winners}`, inline: true },
                )
                .setColor('Random')
                .setTimestamp();
        
            const button = new ButtonBuilder()
                .setCustomId('giveaway_participation')
                .setEmoji('<:8569awards:1236289961922138214>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true); // Désactiver le bouton
        
            const row = new ActionRowBuilder().addComponents(button);
        
            try {
                const giveawayMessage = await interaction.channel.messages.fetch(messageId);
                await giveawayMessage.edit({ embeds: [updatedEmbed], components: [row] });
                await interaction.reply({ content: `Le giveaway a été mis en pause.`, ephemeral: true });
            } catch (error) {
                console.error('Error pausing the giveaway:', error);
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Une erreur est survenue lors de la mise en pause du giveaway.', ephemeral: true });
            }
        
            await giveawayData.save();
        } else if (subcommand === 'reprendre') {
            const messageId = interaction.options.getString('message');
            const giveawayData = await Giveaway.findOne({ messageId });
        
            if (!giveawayData) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Aucun giveaway trouvé avec l\'ID de message ${messageId}.', ephemeral: true });
            }
        
            if (giveawayData.ended) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le giveaway est déjà terminé, vous ne pouvez pas le reprendre.', ephemeral: true });
            }
        
            if (!giveawayData.paused) {
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Le giveaway n\'est pas en pause.', ephemeral: true });
            }
        
            // Calculer la durée de la pause
            const pauseDuration = Date.now() - giveawayData.pauseStartTime;
            giveawayData.endTime += pauseDuration; // Ajouter la durée de la pause au temps de fin
            giveawayData.paused = false;
            giveawayData.pauseStartTime = null;
        
            const updatedEmbed = new EmbedBuilder()
                .setTitle(`🎉 ${giveawayData.prize}`)
                .setDescription(`Cliquez sur le bouton <:8569awards:1236289961922138214> ci-dessous pour participer !\n\n<:DateTimeIcon:1184957483425484872> **Temps restant**: <t:${Math.floor(giveawayData.endTime / 1000)}:R>`)
                .addFields(
                    { name: '<:SoundbarIcon:1182434174100066324> Nombre de Participants', value: `${giveawayData.participants.length}`, inline: true },
                    { name: `<:TheBestServerEmojisIcon:1184958401906753556> ${giveawayData.winners > 1 ? 'Gagnants' : 'Gagnant'}`, value: `${giveawayData.winners}`, inline: true },
                )
                .setColor('Random')
                .setTimestamp(giveawayData.endTime);
        
            const button = new ButtonBuilder()
                .setCustomId('giveaway_participation')
                .setEmoji('<:8569awards:1236289961922138214>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false); // Réactiver le bouton
        
            const row = new ActionRowBuilder().addComponents(button);
        
            try {
                const giveawayMessage = await interaction.channel.messages.fetch(messageId);
                await giveawayMessage.edit({ embeds: [updatedEmbed], components: [row] }); // Mettre à jour le message avec l'embed et le bouton réactivé
                await interaction.reply({ content: 'Le giveaway a été repris avec succès.', ephemeral: true });
            } catch (error) {
                console.error('Error resuming the giveaway:', error);
                return interaction.reply({ content: '<:ErrorIcon:1098685738268229754> Une erreur est survenue lors de la reprise du giveaway.', ephemeral: true });
            }
        
            await giveawayData.save();
        }
    },
};