const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "challenge-roles",
  description:
    "🎯 | Permet de voir les défis à accomplir pour obtenir un rôle.",
  type: 1,
  options: [
    {
      name: "rôle",
      description:
        "Choisis un rôle parmi la liste pour voir les défis à accomplir afin d'obtenir ce rôle",
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
          name: "Panthère noire",
          value: "panthere_noire",
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

    const embed = new EmbedBuilder().setColor("#afe1de");

    switch (action) {
      case "chasseur_de_tresor":
        interaction.reply({
          embeds: [
            embed
              .setTitle("Défis du rôle : Chasseur de trésor")
              .setDescription(
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370872512192614>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Figurines",
                  value:
                    "> Récupérez les 100 figurines dans San Andreas pour obtenir la tenue 'La Rage impuissante'.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Accessoires de film",
                  value:
                    "> Récupérez les 10 accessoires de films dans San Andreas pour obtenir la tenue 'L'Intrus de l'espace'.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cartes à jouer",
                  value:
                    "> Récupérez les 54 cartes dans San Andreas pour obtenir la tenue 'Plein aux As'.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Brouilleurs de signaux",
                  value:
                    "> Détruisez les 50 brouilleurs de signaux dans San Andreas.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> LD Organic",
                  value:
                    "> Récupérez 100 sachets de LD Organic dans San Andreas.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Épaves",
                  value:
                    "> Récupérez tous les lambeaux de tenue dissimulés dans les coffres sur les épaves pour obtenir la tenue 'L'Ouest sauvage'.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Ruée vers l'or",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370964212265061>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Changement de point de vue",
                  value:
                    "> Terminez toutes les missions de braquage à la 1ère personne. Le chef d'équipe doit paramétrer les options de caméra avant le braquage.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cerveau Criminel I",
                  value:
                    "> Terminez les 5 braquages en entier, dans l'ordre, en mode difficile avec la même équipe et sans qu'aucun joueur ne se fasse tuer.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cerveau Criminel II",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 2 joueurs, sans mourir dans les missions de préparation et les phases finales.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cerveau Criminel III",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 3 joueurs, sans mourir dans les missions de préparation et les phases finales.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cerveau Criminel IV",
                  value:
                    "> Terminez le Braquage de la fin du monde dans l'ordre, en difficile avec la même équipe de 4 joueurs, sans mourir dans les missions de préparation et les phases finales.",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370967118921859>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Solomun 25/8",
                  value:
                    "> Dansez sur la musique de Solomun dans une boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> En coordination",
                  value:
                    "> Dansez parfaitement dans une boîte de nuit, sans rater un seul temps pendant 5 minutes.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Pilier de boîte",
                  value: "> Devenez ivre dans une boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Afterlight",
                  value:
                    "> Dansez sur la musique des membres de Tale Of Us dans une boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Wilderness",
                  value:
                    "> Dansez sur la musique de Dixon dans une boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> We Believe",
                  value:
                    "> Dansez sur la musique de The Black Madonna dans une boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Clubbeur",
                  value:
                    "> Dansez sur la musique des 4 DJ dans votre propre boîte de nuit.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Plage de danse",
                  value:
                    "> Dansez sur la musique de Keinemusik à la fête sur la plage de Cayo Perico pendant 60 minutes.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Keinemusik",
                  value:
                    "> Dansez sur la musique de Keinemusik à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Palms Trax",
                  value:
                    "> Dansez sur la musique de Palms Trax à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Moodymann",
                  value:
                    "> Dansez sur la musique de Moodymann à The Music Locker pendant 60 minutes.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Retour à la fête",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370957102911559>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Pegasus :",
                  value:
                    "> Via la carrière d'arène, atteignez le niveau 25 pour débloquer un véhicule Pegasus.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Attention où vous roulez :",
                  value:
                    "> Faites-vous éliminer par un piège lors d'un événement d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Attaque de tour :",
                  value: "> Éliminez 10 joueurs à l'aide des tourelles.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Sports de contact :",
                  value:
                    "> Touchez des joueurs à l'aide des mines cinétiques, IEM et à pointes.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Inarrêtable :",
                  value: "> Modifiez complètement un véhicule d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Prêt à la guerre :",
                  value:
                    "> Appliquez des modifications à vos véhicules d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Dans le viseur :",
                  value:
                    "> Utilisez une longue-vue, un drone ou un streaming live 50 fois en tant que spectateur.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> La roue tourne :",
                  value: "> Utilisez 50 fois la roue de l'arène dans la loge.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Quels pièges ? :",
                  value:
                    "> En tant que spectateur, utilisez 10 fois des pièges contre les joueurs.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Maître-Bandito :",
                  value:
                    "> En tant que spectateur, utilisez les mines cinétiques d'un RC Bandito 10 fois sur des joueurs.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Cible facile :",
                  value:
                    "> En tant que spectateur, utilisez l'IEM du drone de combat 10 fois pour neutraliser des joueurs.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Participation du public :",
                  value: "> En tant que spectateur, éliminez 50 joueurs.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Tuer... ou être tué :",
                  value:
                    "> Pendant des modes d'arène, éliminez 50 joueurs alors que votre véhicule est en mauvais état (<25%).",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Auto-tamponneuses :",
                  value:
                    "> Pendant des événements d'arène, éliminez 50 joueurs en les percutant avec la propulsion latérale.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Du balai ! :",
                  value: "> Éliminez 100 joueurs dans des modes d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> On en a eu un ! :",
                  value: "> Débloquez 50 éléments via la carrière d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Salarié de l'arène :",
                  value: "> Remportez 1.000.000 $ avec les modes d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Assiduité :",
                  value: "> Participez à 100 épreuves d'arène.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Vainqueur en carrière :",
                  value:
                    "> Remportez 100 victoires dans des épreuves d'arène avec un véhicule d'arène personnalisé.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Meilleur score :",
                  value: "> Gagnez 55.000 points d'arène (AP).",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370961137827940>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Cheng d'encre :",
                  value:
                    "> Terminez Cheng d'encre pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Un peu de ménage :",
                  value:
                    "> Terminez Un peu de ménage pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Trèfle de plaisanteries :",
                  value:
                    "> Terminez Trèfle de plaisanteries pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Rois du pétrole :",
                  value:
                    "> Terminez Rois du pétrole pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Terrasse de piques :",
                  value:
                    "> Terminez Terrasse de piques pour la première fois et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Tapis :",
                  value:
                    "> Terminez Tapis pour la première fois et remportez 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Quinte :",
                  value:
                    "> Terminez toutes les missions de l'histoire du casino dans l'ordre et remportez 500.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Top paire :",
                  value:
                    "> Terminez toutes les missions de l'histoire du casino en tant que membre d'équipe et remportez 100.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Full :",
                  value:
                    "> Terminez toutes les missions de l'histoire du casino en tant que chef d'équipe et remportez 100.000 $ et un élément bonus.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Chanceux :",
                  value:
                    "> Terminez une mission de l'histoire du casino sans vous faire tuer et remportez 50.000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Flambeur :",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370951537082450>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Sang-froid :",
                  value:
                    "> Obtenez plus de 90% de précision pour toute une partie de La revanche des Badlands II.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Flingues à l'aube :",
                  value:
                    "> Terminez La revanche des Badlands II en n'utilisant que des pistolets.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Tireur d'élite :",
                  value:
                    "> Tuez 40 créatures volantes sur l'ensemble des niveaux de La revanche des Badlands II.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> As du volant :",
                  value:
                    "> Gagnez 40 courses contre un adversaire dans Course-poursuite.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le roi des bouchons :",
                  value:
                    "> Terminez une course complète sans avoir d'accident dans Course-poursuite.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Toutes roues dehors :",
                  value:
                    "> Terminez Course-poursuite avec tous types de véhicules.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Groggy :",
                  value: "> Terminez La chute du magicien en tant que Grog.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Épée de platine :",
                  value:
                    "> Obtenez un score d'au moins 1 000 000 au cours d'une partie de La chute du magicien.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Bourse :",
                  value:
                    "> Récupérez 950 000 trésors au cours d'une partie de La chute du magicien.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> La grande évasion :",
                  value:
                    "> Survivez à n'importe quel niveau sans subir de dégâts dans Singe de l'espace 3 : Une banane dans le potage.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fort comme un gorille :",
                  value:
                    "> Terminez Singe de l'espace 3 : Une banane dans le potage sans utiliser un seul objet ou amélioration.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Astrosinge :",
                  value:
                    "> Marquez plus de 3 000 000 de points au cours d'une partie de Singe de l'espace 3 : Une banane dans le potage.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Singe aquatique :",
                  value:
                    "> Terminez le niveau sous-marin dans le Paradis des singes.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> La foi est défendue :",
                  value:
                    "> Terminez un niveau de défenseur de la foi en n'appuyant que sur la touche de droite.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Expert :",
                  value:
                    "> Marquez plus de 40 000 points au cours d'une partie de Penetrator.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Grand amour :",
                  value:
                    "> Obtenez un classement Grand amour dans Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Nemesis :",
                  value:
                    "> Trouvez l'être haï en utilisant la borne Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Friendzoné :",
                  value:
                    "> La friendzone n'existe pas, mais peut-être pourrez-vous y finir avec Le Professeur de l'amour.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Dans on QUB3D :",
                  value:
                    "> Atteignez la première place au classement de QUB3D.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Qubisme :",
                  value:
                    "> Atteignez le niveau 20 dans QUB3D sans utiliser de compétence spéciale.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Pousse jusqu'à 11 :",
                  value:
                    "> Obtenez le meilleur score dans Déchaînement de fureur.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Dieu de QUB3D :",
                  value:
                    "> Obtenez un score de 19 000 points en une seule partie de QUB3D.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Qubits :",
                  value:
                    "> Atteignez le niveau 20 sans mettre un bloc hors jeu.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> 11 fois jusqu'à 11 :",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370870008201266>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Repérage :",
                  value:
                    "> Faites un repérage de toutes les entrées et sorties pour le Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Préparation :",
                  value:
                    "> Terminez 40 missions préliminaires du Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> L'équipe au complet :",
                  value:
                    "> Débloquez tous les membres d'équipe possibles pour le Braquage du Diamond Casino.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Voleur d'élite :",
                  value:
                    "> Terminez les défis élite pour les approches en force, rusée et furtive du Braquage du Diamond Casino et gagnez 350 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Professionnel :",
                  value:
                    "> Terminez le Braquage du Diamond Casino en difficile sans perdre une vie et empochez 250 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Collectionneur :",
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
              .setTitle("Défis du rôle : Panthère noire")
              .setDescription(
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370865285398598>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Bourses pleines :",
                  value:
                    "> Volez pour un total de 20 000 000 $ d’objectifs secondaires pendant le Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fortes perturbations :",
                  value:
                    "> Terminez les trois missions préliminaires de perturbations dans une seule partie du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le Braquage de Cayo Perico :",
                  value:
                    "> Terminez le Braquage de Cayo Perico pour la première fois pour remporter 200 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Travail solo :",
                  value:
                    "> Terminez le Braquage de Cayo Perico en solo pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Travail d’équipe :",
                  value:
                    "> Terminez le Braquage de Cayo Perico à 4 joueurs pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fin voleur :",
                  value:
                    "> Terminez le Braquage de Cayo Perico sans jamais alerter les gardes pour gagner 200 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> L’un d’eux :",
                  value:
                    "> Entrez dans la base à l’aide d’un déguisement volé pendant le Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Voleur professionnel :",
                  value:
                    "> Volez toutes les variantes de l’objectif principal pendant le Braquage de Cayo Perico pour gagner 150 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> En long et en large :",
                  value:
                    "> Repérez tous les points d’infiltration et de sortie sur Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Facile d’accès :",
                  value:
                    "> Repérez tous les points d’entrée dans la base d’El Rubio sur Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Bonne affaire :",
                  value:
                    "> Repérez tous les emplacements des objectifs secondaires dans une seule partie du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Plans de voyage :",
                  value:
                    "> Utilisez tous les véhicules d’approche du Braquage de Cayo Perico pour gagner 250 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Bien préparé :",
                  value:
                    "> Terminez 50 missions préliminaires du Braquage de Cayo Perico.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Élitiste :",
                  value:
                    "> Terminez le défi élite pour le Braquage de Cayo Perico pour empocher 200 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Vantard :",
                  value:
                    "> Terminez le Braquage de Cayo Perico en difficile sans perdre une vie et empochez 200 000 $.",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370868439523338>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Salon auto de LS :",
                  value:
                    "> Rendez-vous au salon auto de LS pour la première fois.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Membre du salon auto de LS :",
                  value:
                    "> Atteignez le niveau 100 de réputation du salon auto de LS.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Pilote de rue :",
                  value:
                    "> Remportez 50 courses des Épreuves de course de rue.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Pilote de poursuite :",
                  value: "> Remportez 50 courses des Épreuves de poursuite.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Testé et approuvé :",
                  value:
                    "> Conduisez l'un des véhicules de test sur la piste d'essai pendant 240 minutes.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Livraison spéciale :",
                  value:
                    "> Modifiez et livrez 50 véhicules pour un client depuis votre atelier auto.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Exportateur automobile :",
                  value:
                    "> Livrez 100 véhicules d'export exotiques aux quais pour le partenaire de Sessanta.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Exportateur automobile accompli :",
                  value:
                    "> Livrez 10 véhicules d'export exotiques aux quais en un seul jour et remportez 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Préparer le terrain :",
                  value:
                    "> Terminez 40 missions de préparation de contrats en tant que KDJ et Sessanta.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le contrat de l'Union Depository :",
                  value:
                    "> Terminez Le contrat de l'Union Depository en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le cours du Superdollar :",
                  value:
                    "> Terminez Le cours du Superdollar en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le contrat de la banque :",
                  value:
                    "> Terminez Le contrat de la banque en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le vol de l'UCE :",
                  value:
                    "> Terminez Le vol de l'UCE en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le contrat de la prison :",
                  value:
                    "> Terminez le contrat de la prison en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le marché de l'Agence :",
                  value:
                    "> Terminez Le marché de l'Agence en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le contrat des Lost :",
                  value:
                    "> Terminez Le contrat des Lost en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le contrat des données :",
                  value:
                    "> Terminez Le contrat des données en tant que chef d'équipe pour gagner 75 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Criminel sous contrat :",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1011370815545155644>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Sur le parcours :",
                  value:
                    "> Rencontrez Dr. Dre au club de golf de Los Santos en tant que chef d'équipe pour gagner 50 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Ça fuite en boîte de nuit :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Ça fuite dans la haute :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Ça fuite à South Central :",
                  value:
                    "> Localisez cette copie de la musique volée de Dr. Dre en tant que chef d'équipe pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Temps au studio :",
                  value:
                    "> Aidez Dr. Dre dans son studio de musique en tant que chef d'équipe pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Faites pas chier Dre :",
                  value:
                    "> Traquez le voleur de la musique de Dr. Dre en tant que chef d'équipe pour gagner 250 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Renforts :",
                  value:
                    "> Terminez toute l'histoire de Dr. Dre en tant que membre d'une organisation ou d'un club de motards pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Capital défonce - Franklin :",
                  value:
                    "> Terminez Capital défonce en tant que Franklin pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Capital défonce - Lamar :",
                  value:
                    "> Terminez Capital défonce en tant que Lamar pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Ça part en fumette - Franklin :",
                  value:
                    "> Terminez Ça part en fumette en tant que Franklin pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Obligations contractuelles :",
                  value: "> Terminez 50 contrats de sécurité.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Démarchage téléphonique :",
                  value: "> Terminez 50 contrats par téléphone.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Contrats à la chaîne :",
                  value:
                    "> Terminez tous les contrats par téléphone avec le bonus d'assassinat.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Meilleur ami du chien :",
                  value: "> Caressez Chop.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Balance son :",
                  value: "> Rendez-vous à Record A Studios.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Producteur :",
                  value:
                    "> Regardez Dr. Dre travailler à Record A Studios pendant 60 minutes.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fumette à l'ancienne - Franklin :",
                  value:
                    "> Terminez Fumette à l'ancienne en tant que Franklin pour gagner 100 000 $.",
                  inline: false,
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fumette à l'ancienne - Lamar :",
                  value:
                    "> Terminez Fumette à l'ancienne en tant que Lamar pour gagner 100 000 $.",
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
                "Terminez tous ces défis pour obtenir le rôle : <@&1101200903295488093>"
              )
              .addFields(
                {
                  name: "<:DotIcon:1185215056670109727> Bienvenue à bord",
                  value:
                    "> Terminez Première dose - Bienvenue à bord en tant que chef d'équipe pour gagner 50 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Conduite à risque",
                  value:
                    "> Terminez Première dose - Conduite à risque en tant que chef d'équipe pour gagner 50 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Fatale incursion",
                  value:
                    "> Terminez Première dose - Fatale incursion en tant que chef d'équipe pour gagner 50 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Substance instable",
                  value:
                    "> Terminez Première dose - Substance instable en tant que chef d'équipe pour gagner 50 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Le coup du lapin",
                  value:
                    "> Rejoignez le portail en tant que lapin 10 fois dans Première dose - Substance instable.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Les babas coulent",
                  value:
                    "> Terminez Première dose - Les babas coulent en tant que chef d'équipe pour gagner 50 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Déraillement",
                  value:
                    "> Terminez Première dose - Déraillement en tant que chef d'équipe pour gagner 250 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Appelle-moi",
                  value: "> Terminez 50 missions de Fooliganz pour Dax.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Renforts",
                  value:
                    "> Terminez toutes les missions de Première dose en tant que membre pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Goûte mon acide",
                  value: "> Lancez votre labo d'acide.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Alchimie",
                  value:
                    "> Récupérez 50 fois des matières premières pour le labo d'acide.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Réaction chimique",
                  value: "> Accélérez la production de votre labo d'acide.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> De planque en planque",
                  value: "> Attaquez et pillez 50 planques.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Colis surprise",
                  value:
                    "> Récupérez 20 colis de G à travers Los Santos et Blaine County.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Intervention",
                  value:
                    "> Terminez Dernière dose - Intervention en tant que chef d'équipe pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Inusuels suspects",
                  value:
                    "> Terminez Dernière dose - Inusuels suspects en tant que chef d'équipe pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> FriedMind",
                  value:
                    "> Terminez Dernière dose - FriedMind en tant que chef d'équipe pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Admission médicale",
                  value:
                    "> Terminez Dernière dose - Admission médicale en tant que chef d'équipe pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Votre propre ennemi juré",
                  value: "> Éliminez les versions hostiles de vous-même.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> BDKD",
                  value:
                    "> Terminez Dernière dose - BDKD en tant que chef d'équipe pour gagner 100 000 $.",
                },
                {
                  name: "<:DotIcon:1185215056670109727> Renfort 2",
                  value:
                    "> Terminez toutes les missions de Dernière dose en tant que membre pour gagner 100 000 $.",
                }
              ),
          ],
        });
        break;
    }
  },
};
