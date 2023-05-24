const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client, config) => {

    const modals = fs.readdirSync(`./modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../modals/${file}`);
        if (pull.id) {
            client.modals.set(pull.id, pull);
        } else {
            console.log(`[HANDLER - MODALS] Couldn't load the file ${file}. Missing modal ID.`.red)
            continue;
        }
    }
    if (client.modals.size > 0) console.log(bold.cyanBright("[ModalForms] ") + bold.yellowBright(`Loaded ${client.modals.size} Modals.`));
};
