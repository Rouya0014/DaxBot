const { EmbedBuilder } = require('discord.js');
const ticketSchema = require('../../../models/Ticket');

module.exports = {
    name: "ticket",
    description: "🎫 | Commande pour ajouter ou retirer un membre du salon de ticket.",
    type: 1,
    options: [
        {
            name: "action",
            description: "L'action à effectuer (ajouter ou retirer).",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Ajouter",
                    value: "add"
                },
                {
                    name: "Retirer",
                    value: "remove"
                }
            ]
        },
        {
            name: "utilisateur",
            description: "Le membre à ajouter ou retirer du salon de ticket.",
            type: 6,
            required: true
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "ManageMessages"
    },
    category: "Moderation",
    
    run: async (client, interaction, config, db) => {
        const { guildId, channel } = interaction;
        const action = interaction.options.get("action").value;
        const member = interaction.options.getMember("utilisateur");

        const embed = new EmbedBuilder();
       
        switch (action) {
            case "add":
                ticketSchema.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, data) => {
                    if (err) throw err;
                    if (!data)
                        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Quelque chose s'est mal passé. Réessayez plus tard.", ephemeral: true });

                    if (data.MembersID.includes(member.id))
                        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Ce membre est déjà dans le salon de ticket.", ephemeral: true });

                    data.MembersID.push(member.id);

                    await channel.permissionOverwrites.edit(member.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        ReadMessageHistory: true
                    });

                    await interaction.reply({
                        content: `${member}`,
                        embeds: [embed.setColor("#278048").setAuthor({ name: `${member.user.tag} a été ajouté au ticket.`, iconURL: member.user.displayAvatarURL({ size: 512, dynamic: true }) })]
                    });

                    await data.save();
                });
                break;
            
            case "remove":
                ticketSchema.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, data) => {
                    if (err) throw err;
                    if (!data)
                        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Quelque chose s'est mal passé. Réessayez plus tard.", ephemeral: true });

                    if (!data.MembersID.includes(member.id))
                        return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Ce membre n'est pas dans le salon de ticket.", ephemeral: true });

                    data.MembersID = data.MembersID.filter(id => id !== member.id);

                    await channel.permissionOverwrites.edit(member.id, {
                        SendMessages: false,
                        ViewChannel: false,
                        ReadMessageHistory: false
                    });

                    await interaction.reply({
                        embeds: [embed.setColor("#ee2346").setAuthor({ name: `${member.user.tag} a été retiré du ticket.`, iconURL: member.user.displayAvatarURL({ size: 512, dynamic: true }) })]
                    });
                    
                    await data.save();
                });
                break;
       }
    },
};