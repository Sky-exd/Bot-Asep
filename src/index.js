import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import { CommandKit } from "commandkit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "./config.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.User, Partials.Message, Partials.GuildMember],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { token } = config;

(async () => {
  new CommandKit({
    client,
    eventsPath: join(__dirname, "events"),
    commandsPath: join(__dirname, "commands"),
    // devUserIds: ["1160607274008580126", "587193866831003662"],
    // bulkRegister: true,
  });

  try {
    await client.login(token);
    client.user.setPresence({
      activities: [
        {
          name: `${client.user.username} Bot !`,
          type: ActivityType.Custom,
          state: "Asep AI siap melayani!",
        },
      ],
      status: "online",
    });
  } catch (err) {
    console.log(`Isi Token bot nya !`, err);
  }
})();
