const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require("discord.js");
const schema = require('../../../models/Join-To-Create');

module.exports = {
  name: "setup-jointocreate",
  description: "🔒 | Configurer le système : rejoindre pour créer",
  type: 1,
  options: [
    {
      name: 'salon',
      description: '🔒 | Salon du système rejoindre pour créer',
      type: ApplicationCommandOptionType.Channel,
      required: true,
      channelTypes: [ChannelType.GuildVoice]
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: PermissionFlagsBits.Administrator,
  },
  category: "Info",
  
  run: async (client, interaction, config, db) => {
    const channel = interaction.options.get("salon").value;

    let data = 
      (await schema.findOne({ Guild: interaction.guild.id })) ||
      (await schema.create({ Guild: interaction.guild.id }));

    data.channel = channel;
    await data.save();

    interaction.reply({
      content: `Salon rejoindre pour créer : <#${channel}> configuré avec succès`,
      ephemeral: true
    });

  }
};