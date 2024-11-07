const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client, config) => {

  fs.readdirSync('./commands/prefix/').forEach(dir => {
    const commands = fs.readdirSync(`./commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {

      let pull = require(`../commands/prefix/${dir}/${file}`);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);

       if (pull.config.aliases && Array.isArray(pull.config.aliases)) {
          pull.config.aliases.forEach(alias => {
            client.prefix_commands.set(alias, pull);
          });
        }
      } else {
        console.log(`[Préfixes] Impossible de charger le fichier ${file}, valeur de nom de module manquante .`.red);
        continue;
      };
    };
  });

  if (client.prefix_commands.size > 0) {
    console.log(bold.green
      (`                                                                                                                             
    ,---,                                ,---,.               ___     
  .'  .' \`\\                            ,'  .'  \\            ,--.'|_   
,---.'     \\                         ,---.' .' |   ,---.    |  | :,'  
|   |  .\`\\  |             ,--,  ,--, |   |  |: |  '   ,'\\   :  : ' :  
:   : |  '  |  ,--.--.    |'. \\/ .\`| :   :  :  / /   /   |.;__,'  /   
|   ' '  ;  : /       \\   '  \\/  / ; :   |    ; .   ; ,. :|  |   |    
'   | ;  .  |.--.  .-. |   \\  \\.' /  |   :     \\'   | |: ::__,'| :    
|   | :  |  ' \\__\\/: . .    \\  ;  ;  |   |   . |'   | .; :  '  : |__  
'   : | /  ;  ," .--.; |   / \\  \\  \\ '   :  '; ||   :    |  |  | '.'| 
|   | '\` ,/  /  /  ,.  | ./__;   ;  \\|   |  | ;  \\   \\  /   ;  :    ; 
;   :  .'   ;  :   .'   \\|   :/\\  \\ ;|   :   /    \`----'    |  ,   /  
|   ,.'     |  ,     .-./\`---'  \`--\` |   | ,'                ---\`-'   
'---'        \`--\`---'                \`----'                           
                                                                      
`))
    console.log(bold.red("[Préfixes] ") + bold.cyanBright(`Chargé ${client.prefix_commands.size} Commandes préfixes`));
  }
};
