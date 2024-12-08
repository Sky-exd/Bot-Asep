import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { CommandKit } from "commandkit";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "./config.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  new CommandKit({
    client,
    eventsPath: path.join(__dirname, "events"),
    commandsPath: path.join(__dirname, "commands"),
    devUserIds: ["1160607274008580126", "587193866831003662"],
    bulkRegister: true,
  });

  try {
    await client.login(config.token);
  } catch (err) {
    console.log(`Isi Token bot nya !`);
  }

  client.user.setPresence({
    activities: [
      {
        name: `Asep Bot !`,
        type: ActivityType.Custom,
        state: "Asep siap melayani!",
      },
    ],
    status: "online",
  });
})();
