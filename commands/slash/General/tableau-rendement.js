const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "tableau-rdm",
  description: "📊 | Permet de voir les tableaux de rendement des business.",
  type: 1,
  options: [
    {
      name: "business",
      description: "Choisis le type de business afin de voir son tableau.",
      type: 3,
      required: true,
      choices: [
        {
          name: "actif",
          value: "actif",
        },
        {
          name: "passif",
          value: "passif",
        },
      ],
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction, config, db) => {
    const action = interaction.options.get("business").value;

    const imgtabp = new AttachmentBuilder("./models/fonts/tableau-rendement-BP.png");
    const imgtaba = new AttachmentBuilder("./models/fonts/tableau-rendement-BA.png");

    const embed = new EmbedBuilder().setColor("#b6a9d3");

    switch (action) {
      case "actif":
        interaction.reply({
          embeds: [
            embed
              .setTitle("TABLEAU DE RENDEMENT DES BUSINESS ACTIFS")
              .addFields(
                {
                  name: 'Notes :',
                  value: `> **Frais** = investissements ou part d'associés\n> **Gains** = argent gagné brut\n> **Profit net** = gains - frais\n> **Temps d'attente** = cooldown\n> **Temps de mission** = temps effectué pour les préparatifs et finales\n> **Temps de revente** = temps de livraison des marchandises\n> **Profits par heure de jeu** = argent par heure sur l'activité (Gains **uniquement des finales** des braquages, contrats et missions en **mode difficile**)\n> **Cayo Perico en duo** = Tequila + or + Boost 20% + Coffre $50k + Défi élite\n> **Cayo Perico en solo** = Tequila + Coke + Boost 20% + Coffre $50k + Défi élite\n> **Casino** = Œuvres d'art Équipe : Karl 5%, Karim 5% et Paige 9%`
                },
                {
                  name: 'Hangar 1ère méthode de farm',
                  value: `> Approvisionnez le hangar jusqu'à 40 caisses uniquement avec Rooster, ensuite complétez vous-même à 50 caisses en privilégiant les catégories proches d'un bonus.`
                },
                {
                  name: 'Hangar 2ème méthode de farm',
                  value: `> Approvisionnez votre hangar vous-même en 2 produits de catégorie A (Narcotiques / Produits chimiques / Produits médicaux) par alternance pour éviter les délais d'attente. Lorsque vous serez à 25/25, vous aurez un bonus de +35% sur chacun d'eux.\n> Vous pouvez vendre une des catégories et tenter de compléter l'autre à 50 caisses pour obtenir le bonus de +70%.`
                }
              )
              .setImage('attachment://tableau-rendement-BA.png')
          ],
          files: [imgtaba],
        });
        break;

      case "passif":
        interaction.reply({
          embeds: [
            embed
              .setTitle("TABLEAU DE RENDEMENT DES BUSINESS PASSIFS")
              .addFields(
                {
                  name: 'Notes :',
                  value: `> **Frais** = investissements ou part d'associés\n> **Gains** = argent gagné brut\n> **Profit net** = gains - frais\n> **Temps d'attente** = cooldown\n> **Temps de réappro** = temps effectué pour les réapprovisionnements de matières premières\n> **Temps de revente** = temps de livraison des marchandises\n> **Profits par heure de jeu** = argent par heure sur l'activité`
                },
                {
                  name: 'Informations coffre de la casse',
                  value: `> L'argent du coffre de la casse varie en fonction de la réputation du joueur. Le montant indiqué est pour une réputation de 100% avec le personnel.`
                },
                {
                  name: 'Notes sur le coffre de la casse',
                  value: `> Une mission de remorquage augmente la réputation de votre casse de 25%.\n> Le personnel multiplie les gains du coffre-fort par un facteur de *1,2*.\n> La casse perd 5% de réputation toutes les 48 minutes.`
                }
              )
              .setImage('attachment://tableau-rendement-BP.png')
          ],
          files: [imgtabp],
        });
        break;

    }
  },
};