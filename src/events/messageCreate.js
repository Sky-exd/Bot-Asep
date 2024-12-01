const { Events } = require("discord.js");

const { badWords, responses, balesPesan, commandsBot } = require("./../config");
const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

module.exports = {
  name: Events.MessageCreate,
  async run(message, client) {
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
  },
};
