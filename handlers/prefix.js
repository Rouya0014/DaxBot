const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client, config) => {

  fs.readdirSync('./commands/prefix/').forEach(dir => {
    const commands = fs.readdirSync(`./commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {

      let pull = require(`../commands/prefix/${dir}/${file}`);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);
      } else {
        console.log(`[HANDLER - PREFIX] Couldn't load the file ${file}, missing module name value.`.red)
        continue;
      };
    };
  });
  if (client.prefix_commands.size > 0) console.log(bold.red("[MessageCommands] ") + bold.cyanBright(`Loaded ${client.prefix_commands.size} MessageCommands`));
};
