const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const {
  badWords,
  responses,
  config,
  balesPesan,
  commandsBot,
} = require("./config");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

client.commands = new Collection();

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
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "run" property.`,
      );
    }
  }
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
              .join(", ")}`,
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
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(config.token);
