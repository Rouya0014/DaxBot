const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "🔧 | Affiche la commande help.",
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

    const commandFolders = fs.readdirSync(path.resolve(__dirname, "../"));

    const categories = ["General", "Moderation", "Musique", "help"];

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

    const myCommands = commands
      .filter((command) => generalCommands.includes(command.name))
      .map(
        (command) =>
          `</${command.name}:${command.id}>\n\`${command.description}\``
      )
      .join("\n");

    const generalCommandsEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Commandes générales")
      .setImage(
        "https://media.discordapp.net/attachments/1008116455511961781/1108844839086342317/81c08067832b71ca81d07a3b9c6f9567.png"
      )
      .setDescription(myCommands);

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
      .setColor("Blurple")
      .setTitle("Commandes de modération")
      .setImage(
        "https://media.discordapp.net/attachments/1008116455511961781/1108844839367344188/02e3998f98a8d76312e0564bf4f6cc47_copie.png"
      )
      .setDescription(moderationCommandsString);

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
      .setColor("Blurple")
      .setTitle("Commandes de musique")
      .setImage(
        "https://media.discordapp.net/attachments/1008116455511961781/1108844838843068528/02e3998f98a8d76312e0564bf4f6cc47_copie.png"
      )
      .setDescription(musicCommandsString);

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
          name: "Modération",
          value: `${helpCommandsString} \`info\``,
          inline: true,
        },
        {
          name: "Information",
          value: `${helpCommandsString} \`modération\``,
          inline: true,
        },
        {
          name: "Musique",
          value: `${helpCommandsString} \`musique\``,
          inline: true,
        }
      )
      .setDescription(
        `**Total des commandes Slash**\n\`\`\`js\n${commands.size - 3}\`\`\``
      )
      .setTimestamp()
      .setColor("Blurple")
      .setAuthor({
        name: `Commandes des Modules ${client.user.username}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `Demander par ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const select = new StringSelectMenuBuilder()
      .setCustomId("help")
      .setPlaceholder("Sélectionnez un module pour obtenir de l'aide.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Info")
          .setDescription("Liste de commandes pour Info")
          .setValue("general"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Commande Modération")
          .setDescription("Liste de commandes pour Modération")
          .setValue("moderation"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Commande Musique")
          .setDescription("Liste de commandes pour Musique")
          .setValue("music")
      );

    const action = interaction.options.get("nom_du_module")?.value;

    switch (action) {
      case "information":
        await interaction.reply({ embeds: [generalCommandsEmbed] });
        break;
      case "modération":
        await interaction.reply({ embeds: [moderationCommandsEmbed] });
        break;
      case "musique":
        await interaction.reply({ embeds: [musicCommandsEmbed] });
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
        if (selection === "general") {
          await i.update({ content: null, embeds: [generalCommandsEmbed] });
        } else if (selection === "moderation") {
          await i.update({ content: null, embeds: [moderationCommandsEmbed] });
        } else if (selection === "music") {
          await i.update({ content: null, embeds: [musicCommandsEmbed] });
        }
      });
    }
  },
};
