const {
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  id: "createevent_modal_step2",
  run: async (client, interaction) => {
      try {
          const startDate = interaction.fields.getTextInputValue("event_start_date");
          const startTime = interaction.fields.getTextInputValue("event_start_time");
          const endDate = interaction.fields.getTextInputValue("event_end_date");
          const endTime = interaction.fields.getTextInputValue("event_end_time");

          // Fonction pour convertir la date et l'heure en objet Date en UTC
          function parseDateTime(date, time) {
              const [day, month, year] = date.split('/');
              const [hour, minute] = time.split(':');

              // Crée un objet Date en utilisant le fuseau horaire local
              const localDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

              // Convertir l'objet Date en UTC
              const utcDate = new Date(localDate.toISOString());

              return utcDate;
          }

          const startTimeFull = parseDateTime(startDate, startTime);
          const endTimeFull = parseDateTime(endDate, endTime);

          const now = new Date();

          if (startTimeFull <= now) {
              return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> La date de début de l'événement ne peut pas être dans le passé.", ephemeral: true });
          }

          if (endTimeFull <= startTimeFull) {
              return interaction.reply({ content: "<:ErrorIcon:1098685738268229754> La date de fin de l'événement doit être après la date de début.", ephemeral: true });
          }

          // Récupérer les informations stockées à partir du premier modal
          const { title, description, location, imageUrl } = client.eventCreationData;
          const channel = interaction.guild.channels.cache.get(location.replace(/[<#>]/g, ''));
          const formattedLocation = channel ? `<#${channel.id}>` : location;

          const eventData = {
              name: title,
              description: description,
              scheduledStartTime: startTimeFull,
              scheduledEndTime: endTimeFull,
              privacyLevel: 2,
              entityType: 3,
              entityMetadata: {
                  location: formattedLocation,
              },
              reason: "Création d'un événement via commande",
          };

          if (imageUrl) {
              eventData.image = imageUrl;
          }

          const event = await interaction.guild.scheduledEvents.create(eventData);

          const embed = new EmbedBuilder()
              .setTitle(`<:CreateEventIcon:1182087040746143814> Événement créé : ${event.name}`)
              .setDescription(event.description)
              .addFields(
                  { name: '<:ActiveEventIcon1:1275033859347709982> Date de début', value: `<t:${Math.floor(startTimeFull.getTime() / 1000)}:F>`, inline: true },
                  { name: '<:ActiveEventIcon:1267788668496646155> Date de fin', value: `<t:${Math.floor(endTimeFull.getTime() / 1000)}:F>`, inline: true },
                  { name: '<:EventLocationIcon:1268926464758120479> Localisation', value: event.entityMetadata.location, inline: false }
              )
              .setColor('#5865f2')
              .setTimestamp();

              if (imageUrl) {
                embed.setImage(imageUrl);
            }

          // Envoyer l'embed dans le salon où la commande a été faite
          await interaction.channel.send({ embeds: [embed] });
          await interaction.reply({ content: 'Événement créé !', ephemeral: true})

      } catch (error) {
          console.error(error);
          await interaction.reply({
              content: "<:ErrorIcon:1098685738268229754> Une erreur s'est produite lors de la création de l'événement.",
              ephemeral: true,
          });
      }
  },
};
