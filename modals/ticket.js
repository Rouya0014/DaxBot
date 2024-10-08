const { 
    ChannelType, 
    ButtonInteraction, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder 
  } = require('discord.js');
  const ticketSchema = require("./../models/Ticket");
  const { ticketParent, everyone, Moderator } = require("./../config.json");
  
  module.exports = {
    id: "ticket",
    run: async (client, interaction) => {
      const { guild, customId, channel } = interaction;
      const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;
      const ticketId = Math.floor(Math.random() * 9000) + 10000;
      
      try {
        await interaction.guild.channels.create({
          name: `${interaction.member.user.username}-ticket-${ticketId}`,
          type: ChannelType.GuildText,
          parent: ticketParent,
          permissionOverwrites: [
            {
              id: everyone,
              deny: [ViewChannel, SendMessages, ReadMessageHistory]
            },
            {
              id: interaction.member.id,
              allow: [ViewChannel, SendMessages, ReadMessageHistory]
            },
            {
              id: Moderator,
              allow: [ViewChannel, SendMessages, ReadMessageHistory]
            }
          ]
        }).then(async (channel) => {
          const newTicketSchema = await ticketSchema.create({
            GuildID: guild.id,
            MembersID: interaction.member.id,
            TicketID: ticketId,
            ChannelID: channel.id,
            Closed: false,
            Locked: false,
            Claimed: false,
            Type: interaction.fields.getTextInputValue("titre"),
            ClaimedBy: String
          });
  
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `Ticket : ${customId} de ${interaction.member.user.username}`, 
              iconURL: interaction.member.displayAvatarURL({ dynamic: true })
            })
            .setDescription("Un <@&1008099583831855134> vous contactera sous peu.")
            .addFields({
              name: `${interaction.fields.getTextInputValue("titre")}`, 
              value: `\`\`\`${interaction.fields.getTextInputValue("description")}\`\`\``
            })
            .setColor('5865f2')
            .setFooter({ text: `Ticket ID : ${ticketId}` })
            .setTimestamp();
          
          const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('claim')
              .setLabel('Prendre en charge')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('<:8569awards:1236289961922138214>'),
            new ButtonBuilder()
              .setCustomId('lock')
              .setLabel('Verrouiller le ticket')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🔒'),
            new ButtonBuilder()
              .setCustomId('unlock')
              .setLabel('Déverrouiller le ticket')
              .setStyle(ButtonStyle.Success)
              .setEmoji('🔓'),
            new ButtonBuilder()
              .setCustomId('close')
              .setLabel('Fermer le ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🗑️')
          );
  
          await channel.send({
            content: `Bonjour ${interaction.member}`,
            embeds: [embed],
            components: [button]
          });
  
          const successEmbed = new EmbedBuilder()
            .setColor('278048')
            .setDescription('Ton ticket a été créé avec succès.');
  
          await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        });
      } catch (err) {
        console.error(err);
      }
    }
  };