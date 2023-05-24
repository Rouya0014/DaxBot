const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "challenge-roles",
  description: "🎯 | Permet de voir les défis à faire pour obtenir un rôle.",
  type: 1,
  options: [
    {
      name: "rôle",
      description:
        "Choisis un rôle parmis la liste pour voir ces défis afin d'obtenir son rôle",
      type: 3,
      required: true,
      choices: [
        {
          name: "Chasseur de trésor",
          value: "chasseur_de_tresor",
        },
        {
          name: "Le Professionnel",
          value: "le_professionnel",
        },
        {
          name: "Roi de la Nuit",
          value: "roi_de_la_nuit",
        },
        {
          name: "Gladiateur",
          value: "gladiateur",
        },
        {
          name: "Flambeur",
          value: "flambeur",
        },
        {
          name: "Arcadien",
          value: "arcadien",
        },
        {
          name: "As du Casino",
          value: "as_du_casino",
        },
        {
          name: "Panthère noir",
          value: "panthère_noir",
        },
        {
          name: "Pilote Underground",
          value: "pilote_underground",
        },
        {
          name: "Mercenaire",
          value: "mercenaire",
        },
        {
          name: "Fooliganz",
          value: "fooliganz",
        },
      ],
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "General",
  
  run: async (client, interaction, config, db) => {
    const action = interaction.options.get("rôle").value;

    const embed = new EmbedBuilder().setColor("afe1de");

    switch (action) {
      case "chasseur_de_tresor":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Chasseur de trésor")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370872512192614>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Figurines",
                  value:
                    "> Récupérez les 100 figurines dans San Andreas pour récupérer la tenue 'La Rage impuissante'.",
                },
                {
                  name: "<:dot:1056216329285288058> Accessoires de film",
                  value:
                    "> Récupérez les 10 accessoires de films dans San Andreas pou récupérer la tenue 'L'instrus de l'espace'.",
                },
                {
                  name: "<:dot:1056216329285288058> Cartes à jouer",
                  value:
                    "> Récupérez les 54 cartes dans San Andreas pour récupérer la tenue 'Plein au as'.",
                },
                {
                  name: "<:dot:1056216329285288058> Brouilleurs de signaux",
                  value:
                    "> Détruisez les 50 brouilleurs de signaux dans San Andreas.",
                },
                {
                  name: "<:dot:1056216329285288058> LD Organic",
                  value:
                    "> Récupérez 100 sachets de LD Organic dans San Andreas.",
                },
                {
                  name: "<:dot:1056216329285288058> Épaves",
                  value:
                    "> Récupérez tous les lambeaux de tenue dissimulé dans les coffres sur les épaves pour obtenir la tenue 'L'Ouest sauvage'.",
                },
                {
                  name: "<:dot:1056216329285288058> Ruée vers l'or",
                  value:
                    "> Volez l'arme précieuse d'El Rubio pendant le braquage de Cayo Perico.",
                }
              ),
          ],
        });
        break;

      case "le_professionnel":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Le Professionnel")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370964212265061>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Changement de point de vue",
                  value:
                    "> Terminez tous les missions de braquage à la 1ère personne. Le chef d'équipe doit paramétrer les options de caméra avant le braquage.",
                },
                {
                  name: "<:dot:1056216329285288058> Cerveau Criminel I",
                  value:
                    "> Terminez les 5 braquages en entier, dans l'ordre, en mode difficile avec la même équipe et sans qu'aucun joueur ne se fasse tuer.",
                },
                {
                  name: "<:dot:1056216329285288058> Cerveau Criminel II",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 2 joueurs, sans mourir dans les missions de préparations et phases finales.",
                },
                {
                  name: "<:dot:1056216329285288058> Cerveau Criminel III",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 3 joueurs, sans mourir dans les missions de préparations et phases finales.",
                },
                {
                  name: "<:dot:1056216329285288058> Cerveau Criminel IV",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 4 joueurs, sans mourir dans les missions de préparations et phases finales.",
                }
              ),
          ],
        });
        break;

      case "roi_de_la_nuit":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Roi de la Nuit")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370967118921859>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Solomun 25/8",
                  value:
                    "> Dansez sur la musique de Solomun dans une boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> En coordination",
                  value:
                    "> Dansez parfaitement dans une boîte de nuit, sans rater un seul temps pendant 5 minutes.",
                },
                {
                  name: "<:dot:1056216329285288058> Pilier de boîte",
                  value: "> Devenez ivre dans une boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> Afterlight",
                  value:
                    "> Dansez sur la musique des membres de Tale Of Us dans une boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> Wilderness",
                  value:
                    "> Dansez sur la musique de Dixon dans une boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> We Believe",
                  value:
                    "> Dansez sur la musique de The Black Madonna dans une boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> Clubbeur",
                  value:
                    "> Dansez sur la musique des 4 DJ dans votre propre boîte de nuit.",
                },
                {
                  name: "<:dot:1056216329285288058> Plage de danse",
                  value:
                    "> Dansez sur la musique de Keinemusik à la fête sur la plage de Cayo Perico pendant 60 minutes.",
                },
                {
                  name: "<:dot:1056216329285288058> Keinemusik",
                  value:
                    "> Dansez sur la musique de Keinemusik à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:dot:1056216329285288058> Palms Trax",
                  value:
                    "> Dansez sur la musique de Palms Trax à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:dot:1056216329285288058> Moodymann",
                  value:
                    "> Dansez sur la musique de Moodymann à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:dot:1056216329285288058> Retour à la fête",
                  value:
                    "> Retournez à la fête sur la plage de Cayo Perico après avoir terminé le braquage de Cayo Perico.",
                }
              ),
          ],
        });
        break;

      case "gladiateur":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Gladiateur")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370957102911559>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Pegasus :",
                  value:
                    "> Via la carrière d'arène, atteignez le niveau 25 pour débloquer un véhicule Pegasus.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Attention où vous roulez :",
                  value:
                    "> Faites-vous éliminer par un piège lors d'un évènement d'arène.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Attaque de tour :",
                  value: "> Éliminez 10 joueurs à l'aide des tourelles.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Sports de contact :",
                  value:
                    "> Touchez des joueurs à l'aide des mines kinétiques, IEM et à pointes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Inarrêtable :",
                  value: "> Modifiez complètement un véhicule d'arène.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Prêt à la guerre :",
                  value:
                    "> Appliquez des modifications à vos véhicules d'arènes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Dans le viseur :",
                  value:
                    "> Utilisez une longue-vue, un drone ou un streaming live 50 fois en tant que spectateur.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> La roue tourne :",
                  value: "> Utilisez 50 fois la roue de l'arène dans la loge.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Quels pièges ? :",
                  value:
                    "> En tant que spectateur, utilisez 10 fois des pièges les joueurs.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Maître-Bandito :",
                  value:
                    "> En tant que spectateur utilisez les mines kinétiques d'un RC Bandito 10 fois sur des joueurs.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Cible facile :",
                  value:
                    "> En tant que spectateur, utilisez l'IEM du drone de combat 10 fois pour neutraliser des joueurs.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Participation du public :",
                  value: "> En tant que spectateur, éliminez 50 joueurs.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Tuer... ou être tué :",
                  value:
                    "> Pendant des modes d'arène, éliminez 50 joueurs alors que votre véhicule est en mauvais état (<25%).",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Auto-tamponneuses :",
                  value:
                    "> Pendant des évènements d'arène, éliminez 50 joueurs en les percutant avec la propulsion latérale.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Du balai ! :",
                  value: "> Éliminez 100 joueurs dans des modes d'arène.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> On en a eu un ! :",
                  value: "> Débloquez 50 éléments via la carrière d'arène.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Salarié de l'arène",
                  value: "> Remportez 1.000.000 $ avec les modes d'arènes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Assiduité :",
                  value: "> Participez à 100 épreuves d'arène.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Vainqueur en carrière :",
                  value:
                    "> Remportez 100 victoires dans des épreuves d'arène avec un véhicule d'arène personnalisé.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Meilleur score :",
                  value: "> Gagnez 55.000 point d'arène (AP).",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "flambeur":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Flambeur")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370961137827940>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Cheng d'encre :",
                  value:
                    "Terminez Cheng d'encre pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Un peu de ménage :",
                  value:
                    "Terminez Un peu de ménage pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Trèfle de plaisanteries :",
                  value:
                    "Terminez Trèfle de plaisanteries pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Rois du pétrole :",
                  value:
                    "Terminez Rois du pétrole pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Terrasse de piques :",
                  value:
                    "Terminez Terrasse de piques pour la première fois et remportez 50.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Tapis :",
                  value:
                    "Terminez Tapis pour la première fois et remportez 100.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Quinte :",
                  value:
                    "Terminez toutes les missions de l'histoire du casino dans l'ordre et remportez 500.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Top paire :",
                  value:
                    "Terminez toutes les missions de l'histoire du casino en tant que membre d'équipe et remportez 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Full :",
                  value:
                    "Terminez toutes les missions de l'histoire du casino en tant que chef d'équipe et remportez 100.000 $ et un élément bonus.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Chanceux :",
                  value:
                    "Terminez une mission de l'histoire du casino sans vous faire tuer et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Flambeur :",
                  value: "Terminez 50 jobs du casino pour Agatha.",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "arcadien":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Arcadien")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370951537082450>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Sang froid :",
                  value:
                    "> Obtenez plus de 90% de précision pour toute une partie de La revanche des Badlands II.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Flingues à l'aube :",
                  value:
                    "> Terminez La revanche des Badlands II en n'utilisant que des pistolets.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Tireur d'élite :",
                  value:
                    "> Tuez 40 créatures volantes sur l'ensemble des niveaux de La revanche des Badlands II.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> As du volant :",
                  value:
                    "> Gagnez 40 courses contre un adversaire dans Course-poursuite.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le roi des bouchons :",
                  value:
                    "> Terminez une course complète sans avoir d'accident dans Course-poursuite.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Toutes roues dehors :",
                  value:
                    "> Terminez Course-poursuite avec tous types de véhicules.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Groggy :",
                  value: "> Terminez la chute du magicien en tant que Grog.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Épée de platine :",
                  value:
                    "> Obtenez un score d'au moins 1 000 000 au cours d'une partie de La chute du magicien.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Bourse :",
                  value:
                    "> Récupérez 950 000 trésors au cours d'une partie de La chute du magicien.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> La grande évasion :",
                  value:
                    "> Survivez à n'importe quel niveau sans subir de dégâts dans Singe de l'espace 3 : Une banane dans le potage.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Fort comme un gorille :",
                  value:
                    "> Terminez Singe de l'espace 3 : Une banane dans le potage sans utiliser un seul objet ou amélioration.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Astrosinge :",
                  value:
                    "> Marquez plus de 3 000 000 de points au cours d'une partie de Singe de l'espace 3 : Une banane dans le potage.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Singe aquatique :",
                  value:
                    "> Terminez le niveau sous marin dans le Paradis des singes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> La foi est défendue :",
                  value:
                    "> Terminez un niveau de défenseur de la foi en n'appuyant que sur la touche de droite.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Expert :",
                  value:
                    "> Marquez plus de 40 000 points au cours d'une partie de Penetrator.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Grand amour :",
                  value:
                    "> Obtenez un classement Grand amour dans Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Nemesis :",
                  value:
                    "> Trouvez l'être haï en utilisant la borne Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Friendzoné :",
                  value:
                    "> La friendzone n'existe pas, mais peut-être pourrez-vous y finir avec Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Dans on QUB3D :",
                  value:
                    "> Atteignez la première place au classement de QUB3D.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Qubisme :",
                  value:
                    "> Atteignez le niveau 20 dans QUB3D sans utiliser de compétence spéciale.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Pousse jusqu'à 11 :",
                  value:
                    "> Obtenez le meilleur score dans Déchaînement de fureur.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Dieu de QUB3D :",
                  value:
                    "> Obtenez un score de 19 000 points en une seule partie de QUB3D.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Qubits :",
                  value:
                    "> Atteignez le niveau 20 sans mettre un bloc hors jeu.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> 11 fois jusqu'à 11 :",
                  value:
                    "> Obtenez le meilleur score à 11 reprises dans Déchaînement de fureur.",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "as_du_casino":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : As du Casino")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370870008201266>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Repérage :",
                  value:
                    "> Faites un repérage de toutes les entrées et sorties pour le Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Préparation :",
                  value:
                    "> Terminez 40 missions préliminaires du Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> L'équipe au complet :",
                  value:
                    "> Débloquez tous les membres d'équipe possible pour Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Voleur d'élite :",
                  value:
                    "> Terminez les défis élite pour les approches en force, rusée et furtive du Braquage du Diamond Casino et gagnez 350.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Professionnel :",
                  value:
                    "> Terminez le Braquage du Diamond Casino en Difficile sans perdre une vie et empochez 250.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Collectionneur :",
                  value:
                    "> Volez tous les différents types de butin dans la chambre-forte pendant le Braquage du Diamond Casino.",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "panthère_noir":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Panthère noir")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370865285398598>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Bourses pleines :",
                  value:
                    "> Volez pour un total de 20.000.000 $ d’objectifs secondaires pendant le Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Fortes perturbations :",
                  value:
                    "> Terminez les trois missions préliminaires de perturbations dans une seule partie du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le Braquage de Cayo Perico :",
                  value:
                    "> Terminez le Braquage de Cayo Perico pour la première fois pour remporter 200 000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Travail solo :",
                  value:
                    "> Terminez le Braquage de Cayo Perico en solo pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Travail d’équipe :",
                  value:
                    "> Terminez le Braquage de Cayo Perico à 4 joueurs pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Fin voleur :",
                  value:
                    "> Terminez le Braquage de Cayo Perico sans jamais alerter les gardes pour gagner 200.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> L’un deux :",
                  value:
                    "> Entrez dans la base à l’aide d’un déguisement volé pendant le Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Voleur professionnel :",
                  value:
                    "> Volez toutes les variantes de l’objectif principal pendant le Braquage de Cayo Perico pour gagner 150 000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> En long et en large :",
                  value:
                    "> Repérez tous les points d’infiltration et de sortie sur Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Facile d’accès :",
                  value:
                    "> Repérez tous les points d’entrée dans la base d’El Rubio sur Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Bonne affaire :",
                  value:
                    "> Repérez tous les emplacements des objectifs secondaires dans une seule partie du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Plans de voyage :",
                  value:
                    "> Utilisez tous les véhicules d’approche du Braquage de Cayo Perico pour gagner 250.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Bien préparé :",
                  value:
                    "> Terminez 50 missions préliminaires du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Élitiste :",
                  value:
                    "> Terminez le défi élite pour le Braquage de Cayo Perico pour empocher 200.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Vantard :",
                  value:
                    "> Terminez le Braquage de Cayo Perico en Difficile sans perdre une vie et empochez 200.000 $.",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "pilote_underground":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Pilote Underground")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370868439523338>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Salon auto de LS :",
                  value:
                    "> Rendez vous au salon auto de LS pour la première fois.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Membre du salon auto de LS :",
                  value:
                    "> Atteignez le niveau 100 de réputation du salon auto de LS.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Pilote de rue :",
                  value:
                    "> Remportez 50 courses des Épreuves de course de rue.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Pilote de poursuite :",
                  value: "> Remportez 50 courses des Épreuves de poursuite.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Testé et approuvé :",
                  value:
                    "> Conduisez l'un des véhicules de test sur la piste d'essai pendant 240 minutes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Livraison spéciale :",
                  value:
                    "> Modifiez et livrez 50 véhicules pour un client depuis votre atelier auto.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Exportateur Automobile :",
                  value:
                    "> Livrez 100 véhicules d'export exotiques aux quais pour le partenaire de Sessanta.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Exportateur Automobile accompli :",
                  value:
                    "> Livrez 10 véhicules d'export exotiques aux quais en un seul jour et remportez 100.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Préparer le terrain :",
                  value:
                    "> Terminez 40 missions de préparation de contrats en tant que KDJ et Sessanta.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le contrat de l'Union Depository :",
                  value:
                    "> Terminez Le contrat de l'Union Depository en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le cours du Superdollar :",
                  value:
                    "> Terminez Le cours du Superdollar en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le contrat de la banque :",
                  value:
                    "> Terminez Le contrat de la banque en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le vol de L'UCE :",
                  value:
                    "> Terminez Le vol de l'UCE en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le contrat de la prison :",
                  value:
                    "> Terminez le contrat de la prison en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le marché de l'Agence :",
                  value:
                    "> Terminez Le marché de l'Agence en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le contrat des Lost :",
                  value:
                    "> Terminez Le contrat des Lost en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Le contrat des données :",
                  value:
                    "> Terminez Le contrat des données en tant que chef d'équipe pour gagner 75.000$.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Criminel sous contrat :",
                  value: "> Terminez 100 contrats de KDJ et Sessanta.",
                  inline: false,
                }
              ),
          ],
        });
        break;

      case "mercenaire":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Mercenaire")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1011370815545155644>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Sur le parcours :",
                  value:
                    "> Rencontrez Dr. Dre au club de golf de Los Santos en tant que chef d'équipe pour gagner 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Ça fuite en boîte de nuit :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Ça fuite dans la haute :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Ça fuite à South Central :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Temps au studio :",
                  value:
                    "> Aidez Dr. Dre dans son studio de musique en tant que chef d'équipe pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Faites pas chier Dre :",
                  value:
                    "> Traquez le voleur de la musique de Dr. Dre en tant que chef d'équipe pour gagner 250.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Renforts :",
                  value:
                    "> Terminez toute l'histoire de Dr. Dre en tant que membre d'une organisation ou d'un club de motards pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Capital défonce - Franklin :",
                  value:
                    "> Terminez Capital défonce en tant que Franklin pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Capital défonce - Lamar :",
                  value:
                    "> Terminez Capital défonce en tant que Lamar pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Ça part en fumette - Franklin :",
                  value:
                    "> Terminez Ça part en fumette en tant que Franklin pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Obligations contractuelles :",
                  value: "> Terminez 50 contrats de sécurité.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Démarchage téléphonique :",
                  value: "> Terminez 50 contrats par téléphone.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Contrats à la chaîne :",
                  value:
                    "> Terminez tous les contrats par téléphone avec le bonus d'assassinat.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Meilleur ami du chien :",
                  value: "> Caressez Chop.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Balance son :",
                  value: "> Rendez-vous à Record A Studios.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Producteur :",
                  value:
                    "> Regardez Dr. Dre travailler à Record A Studios pendant 60 minutes.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Fumette à l'ancienne - Franklin :",
                  value:
                    "> Terminez Fumette à l'ancienne en tant que Franklin pour gagner 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:dot:1056216329285288058> Fumette à l'ancienne - Lamar :",
                  value:
                    "> Terminez Fumette à l'ancienne en tant que Lamar pour gagner 100.000 $.",
                  inline: false,
                }
              ),
          ],
        });
        break;
      case "fooliganz":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Fooliganz")
              .setDescription(
                "Terminer tous ces défis pour obtenir le rôle : <@&1101200903295488093>"
              )
              .addFields(
                {
                  name: "<:dot:1056216329285288058> Bienvenue à bord",
                  value:
                    "> Terminez Première dose - Bienvenue à bord en tant que chef d'équipe pour gagner 50 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Conduite à risque",
                  value:
                    "> Terminez Première dose - Conduite à risque en tant que chef d'équipe pour gagner 50 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Fatale incursion",
                  value:
                    "> Terminez Première dose - Fatale incursion en tant que chef d'équipe pour gagner 50 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Substance instable",
                  value:
                    "> Terminez Première dose - Substance instable en tant que chef d'équipe pour gagner 50 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Le coup du lapin",
                  value:
                    "> Rejoignez le portail en tant que lapin 10 fois dans Première dose - Substance instable",
                },
                {
                  name: "<:dot:1056216329285288058> Les babas coulent",
                  value:
                    "> Terminez Première dose - Les babas coulent en tant que chef d'équipe pour gagner 50 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Déraillement",
                  value:
                    "> Terminez Première dose - Déraillement en tant que chef d'équipe pour gagner 250 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Appelle-moi",
                  value: "> Terminez 50 missions de Fooliganz pour Dax",
                },
                {
                  name: "<:dot:1056216329285288058> Renforts",
                  value:
                    "> Terminez toutes les missions de Première dose en tant que membre pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Goûte mon acide",
                  value: "> Lancez votre labo d'acide",
                },
                {
                  name: "<:dot:1056216329285288058> Alchimie",
                  value:
                    "> Récupérez 50 fois des matières premières pour le labo d'acide.",
                },
                {
                  name: "<:dot:1056216329285288058> Réaction chimique",
                  value: "> Accélérez la production de votre labo d'acide",
                },
                {
                  name: "<:dot:1056216329285288058> De planque en planque",
                  value: "> Attaquez et pillez 50 planques",
                },
                {
                  name: "<:dot:1056216329285288058> Colis surprise",
                  value:
                    "> Récupérez 20 colis de G à travers Los Santos et Blaine County",
                },
                {
                  name: "<:dot:1056216329285288058> Intervention",
                  value:
                    "> Terminez Dernière dose - Intervention en tant que chef d'équipe pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Inusuels suspects",
                  value:
                    "> Terminez Dernière dose - Inusuels suspects en tant que chef d'équipe pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> FriedMind",
                  value:
                    "> Terminez Dernière dose - FriedMind en tant que chef d'équipe pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Admission médicale",
                  value:
                    "> Terminez Dernière dose - Admission médicale en tant que chef d'équipe pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Votre propre ennemi juré",
                  value: "> Éliminez les versions hostiles de vous-même.",
                },
                {
                  name: "<:dot:1056216329285288058> BDKD",
                  value:
                    "> Terminez Dernière dose - BDKD en tant que chef d'équipe pour gagner 100 000 $",
                },
                {
                  name: "<:dot:1056216329285288058> Renfort 2",
                  value:
                    "> Terminez toutes les missions de Dernière dose en tant que membre pour gagner 100 000 $",
                }
              ),
          ],
        });
        break;
    }
  },
};