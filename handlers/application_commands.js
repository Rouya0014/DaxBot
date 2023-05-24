const client = require("../index");
const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client, config) => {

  let commands = [];

  // Slash commands handler:
  fs.readdirSync('./commands/slash/').forEach((dir) => {
    const SlashCommands = fs.readdirSync(`./commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      if (pull.name, pull.description, pull.type == 1, pull.category) {
        client.slash_commands.set(pull.name, pull);

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null,
          category: pull.category
        });
      } else {
        console.log(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`.red)
        continue;
      };
    };
  });
  if (client.slash_commands.size > 0) console.log(bold.magenta("[SlashCommands] ") + bold.white(`Loaded ${client.slash_commands.size} SlashCommands.`));

  // User commands handler:
  fs.readdirSync('./commands/user/').forEach((dir) => {
    const UserCommands = fs.readdirSync(`./commands/user/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/user/${dir}/${file}`);

      if (pull.name, pull.type == 2) {
        client.user_commands.set(pull.name, pull);

        commands.push({
          name: pull.name,
          type: pull.type || 2,
        });

      } else {
        console.log(`[HANDLER - USER] Couldn't load the file ${file}, missing module name value or type isn't 2.`.red)
        continue;
      };
    };
  });

  // Message commands handler:
  fs.readdirSync('./commands/message/').forEach((dir) => {
    const UserCommands = fs.readdirSync(`./commands/message/${dir}`).filter((file) => file.endsWith('.js'));

    for (let file of UserCommands) {
      let pull = require(`../commands/message/${dir}/${file}`);

      if (pull.name, pull.type == 3) {
        client.message_commands.set(pull.name, pull);
        if (client.user_commands.size > 0) console.log(bold.whiteBright("[MessageCommands] ") + bold.greenBright(`Loaded ${client.user_commands.size} MessageCommands.`));

        commands.push({
          name: pull.name,
          type: pull.type || 3,
        });

      } else {
        console.log(`[HANDLER - MESSAGE] Couldn't load the file ${file}, missing module name value or type isn't 2.`.red)
        continue;
      };
    };
  });

  // Registering all the application commands:
  if (!config.CLIENT_ID) {
    console.log("[CRASH] You need to provide your bot ID in config.json!".red + "\n");
    return process.exit();
  };

  const rest = new REST({ version: '10' }).setToken(config.token);

  (async () => {

    try {
      await rest.put(
        Routes.applicationCommands(config.CLIENT_ID),
        { body: commands }
      );

    } catch (err) {
      console.log(err);
    }
  })();
};
