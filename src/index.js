import {
  Client,
  GatewayIntentBits,
  ActivityType,
  Partials,
  Events,
} from "discord.js";
import { CommandKit } from "commandkit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "./config.js";
import { logger } from "./logger.js";

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
  });
  client.on(Events.Warn, (warn) => logger.warn(warn));
  client.on(Events.Debug, (debug) => logger.debug(debug));
  client.on(Events.Error, (err) => logger.error(err));
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
      status: "Online",
    });
  } catch (err) {
    console.log(`Isi Token bot nya !`, err);
  }
})();
