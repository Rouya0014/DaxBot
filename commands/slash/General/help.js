const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  AttachmentBuilder
} = require("discord.js");

module.exports = {
  name: "help",
  description: "🔧 | Affiche la commande d'aide.",
  type: 1,
  options: [
    {
      name: "nom_du_module",
      description: "Nom du module pour obtenir les commandes",
      type: 3,
      required: false,
      choices: [
        {
          name: "Information",
          value: "information",
        },
        {
          name: "Modération",
          value: "modération",
        },
        {
          name: "Musique",
          value: "musique",
        },
        {
          name: "Mini-jeu",
          value: "games",
        },
      ],
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  category: "help",

  run: async (client, interaction, config, db) => {
    const fs = require("fs");
    const path = require("path");

    const infoimg = new AttachmentBuilder("./models/fonts/UserProfil-img.png");
    const modimg = new AttachmentBuilder("./models/fonts/Automod-img.png");
    const musicimg = new AttachmentBuilder("./models/fonts/Musique-img.png");
    const gamesimg = new AttachmentBuilder("./models/fonts/Economy-img.png");

    const commandFolders = fs.readdirSync(path.resolve(__dirname, "../"));

    const categories = ["General", "Moderation", "Musique", "Games", "help"];

    const commandsByCategory = {};
    for (const category of categories) {
      commandsByCategory[category] = [];
    }

    for (const folder of commandFolders) {
      const commandPath = path.resolve(__dirname, `../${folder}`);
      const commandFiles = fs.readdirSync(commandPath);

      for (const file of commandFiles) {
        const command = require(commandPath + `/${file}`);
        if (categories.includes(command.category)) {
          commandsByCategory[command.category].push(command);
        }
      }
    }

    const commands = await client.application.commands.fetch();

    const generalCommands = commandsByCategory["General"].map(
      (command) => command.name
    );

    const generalCommandsString = commands
      .filter((command) => generalCommands.includes(command.name))
      .map(
        (command) =>
          `</${command.name}:${command.id}>\n\`${command.description}\``
      )
      .join("\n");

    const generalCommandsEmbed = new EmbedBuilder()
      .setColor("#5afdf9")
      .setTitle("Commandes générales")
      .setImage(
        "attachment://UserProfil-img.png"
      )
      .setDescription(generalCommandsString);

      const musicCommands = commandsByCategory["Musique"].map(
        (command) => command.name
      );
  
      const musicCommandsString = commands
        .filter((command) => musicCommands.includes(command.name))
        .map(
          (command) =>
            `</${command.name}:${command.id}>\n\`${command.description}\``
        )
        .join("\n");
        
      const musicCommandsEmbed = new EmbedBuilder()
        .setColor("#9992d9")
        .setTitle("Commandes de musique")
        .setImage(
          "attachment://Musique-img.png"
        )
        .setDescription(musicCommandsString);

        const EconomyCommands = commandsByCategory["Games"].map(
          (command) => command.name
        );
    
        const EconomyCommandsString = commands
          .filter((command) => EconomyCommands.includes(command.name))
          .map(
            (command) =>
              `</${command.name}:${command.id}>\n\`${command.description}\``
          )
          .join("\n");
          
        const EconomyCommandsEmbed = new EmbedBuilder()
          .setColor("#e9f862")
          .setTitle("Commandes des Mini-jeux")
          .setImage(
            "attachment://Economy-img.png"
          )
          .setDescription(EconomyCommandsString);

    const moderationCommands = commandsByCategory["Moderation"].map(
      (command) => command.name
    );

    const moderationCommandsString = commands
      .filter((command) => moderationCommands.includes(command.name))
      .map(
        (command) =>
          `</${command.name}:${command.id}>\n\`${command.description}\``
      )
      .join("\n");

    const moderationCommandsEmbed = new EmbedBuilder()
      .setColor("#fc964c")
      .setTitle("Commandes de modération")
      .setImage(
        "attachment://Automod-img.png"
      )
      .setDescription(moderationCommandsString);


    const helpCommands = commandsByCategory["help"].map(
      (command) => command.name
    );

    const helpCommandsString = commands
      .filter((command) => helpCommands.includes(command.name))
      .map((command) => `</${command.name}:${command.id}>`)
      .join("\n\n");

    const embed = new EmbedBuilder()
      .addFields(
        {
          name: "Information",
          value: `${helpCommandsString} \`info\``,
          inline: true,
        },
        {
          name: "Musique",
          value: `${helpCommandsString} \`musique\``,
          inline: true,
        },
        {
          name: "Mini-jeu",
          value: `${helpCommandsString} \`games\``,
          inline: true,
        },
        {
          name: "Modération",
          value: `${helpCommandsString} \`modération\``,
          inline: true,
        },
      )
      .setDescription(
        `**Total des commandes Slash**\n\`\`\`js\n${commands.size - 12}\`\`\``
      )
      .setTimestamp()
      .setColor("#5865f2")
      .setAuthor({
        name: `Commandes des modules ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `Demandé par ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const select = new StringSelectMenuBuilder()
      .setCustomId("help")
      .setPlaceholder("Sélectionnez un module pour obtenir de l'aide.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Information")
          .setDescription("Liste des commandes pour Information")
          .setValue("information"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Musique")
          .setDescription("Liste des commandes pour Musique")
          .setValue("musique"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Mini-jeu")
          .setDescription("Liste des commandes pour Mini-jeu")
          .setValue("games"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Modération")
          .setDescription("Liste des commandes pour Modération")
          .setValue("modération"),
      );

    const action = interaction.options.getString("nom_du_module");

    switch (action) {
      case "information":
        await interaction.reply({ embeds: [generalCommandsEmbed], files: [infoimg], });
        break;
      case "musique":
        await interaction.reply({ embeds: [musicCommandsEmbed], files: [musicimg], });
        break;
      case "games":
        await interaction.reply({ embeds: [EconomyCommandsEmbed], files: [gamesimg], });
        break;
      case "modération":
        await interaction.reply({ embeds: [moderationCommandsEmbed], files: [modimg], });
        break;
    }
    if (!action) {
      const row = new ActionRowBuilder().addComponents(select);

      const response = await interaction.reply({
        embeds: [embed],
        components: [row],
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        const selection = i.values[0];
        if (selection === "information") {
          await i.update({ content: null, embeds: [generalCommandsEmbed], files: [infoimg] });
        } else if (selection === "musique") {
          await i.update({ content: null, embeds: [musicCommandsEmbed], files: [musicimg] });
        } else if (selection === "games") {
          await i.update({ content: null, embeds: [EconomyCommandsEmbed], files: [gamesimg] });
        } else if (selection === "modération") {
          await i.update({ content: null, embeds: [moderationCommandsEmbed], files: [modimg] });
        }
      });
    }
  },
};