const { REST, Routes } = require("discord.js");
const { config } = require("./config");
const fs = require("fs");
const path = require("path");

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "run" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] Perintah di file ${filePath} tidak ada "data" dan "run"`,
      );
    }
  }
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("daftar slash command");
    await rest.put(
      Routes.applicationGuildCommands(config.clientID, config.guildID),
      { body: commands },
    );
    console.log("selesai daftar slash command");
  } catch (error) {
    console.log(`error ni bang ${error}`);
  }
})();
