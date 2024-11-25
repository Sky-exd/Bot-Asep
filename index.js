const { Client, Events, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { config, responses, commandsBot, balesPesan } = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

client.commands = new Map();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (c) => {
  console.log(`Bot ${c.user.tag} telah berhasil login`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content === "cek commands") message.reply(commandsBot);

  if (badWords.some((word) => message.content.toLowerCase().includes(word))) {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomResponse);
  }

  for (const dataPesan of balesPesan)
    if (message.content === dataPesan.pesan) message.reply(dataPesan.balesan);

  if (message.content === "cek commands") message.reply(commandsBot);
  if (message.mentions.has(client.user)) message.reply("Kenapa bang?");

  // Perintah untuk menampilkan role pengguna yang ditandai
  if (message.content.startsWith("cek role")) {
    const mentionedUser = message.mentions.users.first();
    mentionedUser
      ? message.guild.members.cache.get(mentionedUser.id)
        ? message.reply(
            `Role untuk ${
              mentionedUser.username
            } : ${message.guild.members.cache
              .get(mentionedUser.id)
              .roles.cache.filter((role) => role.name !== "@everyone")
              .map((role) => role.name)
              .join(", ")}`
          )
        : message.reply("Pengguna tidak ditemukan di server ini!")
      : message.reply("Tolong tag pengguna yang ingin dicek rolenya.");
  }

  // Perintah untuk menampilkan gambar melalui link
  if (message.content.startsWith("cek gambar"))
    message.content.match(imageUrlPattern)
      ? message.channel.send({
          files: [message.content.match(imageUrlPattern)[0]],
        })
      : message.reply("Tidak ada URL gambar yang ditemukan dalam pesan.");

  // Perintah untuk menampilkan video melalui link
  if (
    message.content.startsWith("cek video") ||
    /https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|facebook\.com|twitter\.com|tiktok\.com|)/i.test(
      message.content
    )
  ) {
    const videoUrlPattern = /(https?:\/\/[^\s]+)/g;
    const videoUrls = message.content.match(videoUrlPattern);
    // TODO: nanti dibenerin
    if (videoUrls) {
      videoUrls.forEach((url) => {
        console.log("hai");
        console.log(url);
      });
    } else {
      message.reply("Tidak ada URL video yang ditemukan dalam pesan.");
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        "Ada yang salah ama command nya bang!! tolong di perhatikan lagi",
      ephemeral: true,
    });
  }
});

client.login(config.token);
