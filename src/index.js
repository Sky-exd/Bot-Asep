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
const { token, guildID } = config;


(async () => {
  new CommandKit({
    client,
    eventsPath: join(__dirname, "events"),
    commandsPath: join(__dirname, "commands"),
    devRoleIds: ["1231653267126095903", "1043103873902051338"],
    devGuildIds: [guildID],
    devUserIds: ["1160607274008580126", "587193866831003662"],
    bulkRegister: true,
  });
  try {
    //ketika member masuk
  client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send('selamat datang di server, ${member}!');
  });

  //ketika member keluar
  client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'goodbye');
    if (!channel) return;
    channel.send('Selamat tinggal, ${member.displayName}. Kami akan menunggu mu kembali!');
  });
    await client.login(token);
    client.user.setPresence({
      activities: [
        {
          name: `${client.user.username} Bot !`,
          type: ActivityType.Custom,
          state: "Asep AI siap melayani!",
        },
      ],
<<<<<<< HEAD
      status: "online",
=======
      status: "Online",
>>>>>>> refs/remotes/origin/master
    });
  } catch (err) {
    console.log(`Isi Token bot nya !`, err);
  }
})();
