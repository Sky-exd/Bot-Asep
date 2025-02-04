import { REST, Routes } from "discord.js";
import { config } from "./config.js";

const clientId = "1298925178226610176";
const guildId = "1043102701778653264";
const { token } = config;
const rest = new REST().setToken(token);

(async () => {
  try {
    console.log("Mengambil daftar perintah...");
    const commands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId),
    );
    // const commands = await rest.get(Routes.applicationCommands(clientId));

    console.log(commands);

    const commandId = ["1328574912096505918", "1328574913711444100"];
    // await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    //   body: [],
    // });
    // commandId.forEach(async (cmdi) => {
    //   await rest.delete(
    //     Routes.applicationGuildCommands(clientId, guildId, cmdi),
    //   );
    //   console.log(`Berhasil menghapus command dengan ID ${cmdi}`);
    // });
  } catch (error) {
    console.error(error);
  }
})();
