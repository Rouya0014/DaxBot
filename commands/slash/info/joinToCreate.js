const { ApplicationCommandOptionType, Client, PermissionFlagsBits, ChannelType, GuildVoice } = require("discord.js");
const schema = require('../../../models/Join-To-Create')

module.exports = {
    name: "setup-jointocreate",
    description: "🔒 | configurer système : rejoindre pour créer",
    type: 1,
    options: [
      {
        name: 'salon',
        description: '🔒 | Channel of the join to create system',
        type: ApplicationCommandOptionType.Channel,
        required: true,
        channel_types: [ChannelType.GuildVoice]
      },
    ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "Administrator"
  },
  category: "Info",
  
  run: async (client, interaction, config, db) => {
    const channel = interaction.options.get("salon").value

    data = 
      (await schema.findOne({ Guild: interaction.guild.id })) ||
      (await schema.create({ Guild: interaction.guild.id }));

    data.channel = channel
    await data.save()

    interaction.reply({
      content: `join to create channel : <#${channel}> successfully set`, ephemeral: true
    });

  }
}