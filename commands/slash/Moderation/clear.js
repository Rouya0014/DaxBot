const { EmbedBuilder, ApplicationCommandOptionType, Collection, Message } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "clear",
    description: "🔨 | Supprime un nombre de messages.",
    type: 1,
    options: [
        {
          name: 'nombre',
          description: 'Le nombre de messages que vous souhaitez supprimer (entre 1 et 500)',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
        {
            name: "membre",
            description: "Spécifiez le membre",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
          },
      ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "ManageMessages"
    },
    category: "Moderation",
    
    run: async (client, interaction, config, db) => {
        const channel = interaction.channel;
        const target = interaction.options.get("membre");
        const amount = interaction.options.get("nombre").value;
        
        const messages = await channel.messages.fetch({
            limit: amount + 1,
        }).catch(error => {
            console.error(error);
            return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de la récupération des messages.", ephemeral: true });
        });
          
        const res = new EmbedBuilder()
            .setColor("#278048");
          
        if (target) {
            let i = 0;
            const filtered = [];
          
            messages.forEach(msg => {
              if (msg.author.id === target.user.id && amount > i) {
                filtered.push(msg);
                i++;
              }
            });
          
            if (filtered.length === 0) {
              return interaction.reply({ content: `Je n'ai trouvé aucun message récent de ${target.user.username} à supprimer.`, ephemeral: true });
            }
          
            await channel.bulkDelete(filtered).then(deletedMessages => {
              res.setDescription(`J'ai supprimé ${deletedMessages.size} messages de ${target.user.username}.`);
              return interaction.reply({ embeds: [res], ephemeral: true });
            }).catch(error => {
              console.error(error);
              return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de la suppression des messages.", ephemeral: true });
            });
        } else {
            await channel.bulkDelete(amount, true).then(deletedMessages => {
              res.setDescription(`J'ai supprimé ${deletedMessages.size} messages.`);
              return interaction.reply({ embeds: [res], ephemeral: true });
            }).catch(error => {
              console.error(error);
              return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de la suppression des messages.", ephemeral: true });
            });
        }
    }
};