import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { CommandKit } from "commandkit";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "./config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initBot() {
  new CommandKit({
    client,
    eventsPath: path.join(__dirname, "events"),
    commandsPath: path.join(__dirname, "commands"),
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
}

initBot();
