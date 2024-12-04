import { badWords, balesPesan, responses, commandsBot } from "../../config.js";

const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

export default function (message, client) {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  // otomatis balas pesan
  for (const data of balesPesan)
    if (msg === data.pesan) message.reply(data.balesan);

  if (message.mentions.has(client.user)) message.reply("Kenapa bang?");

  if (msg === "cek perintah") message.reply(commandsBot);

  if (badWords.some((word) => msg.includes(word))) {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomResponse);
  }

  // Perintah untuk menampilkan role pengguna yang ditandai
  if (msg.startsWith("cek role")) {
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
  if (msg.startsWith("cek gambar"))
    msg.match(imageUrlPattern)
      ? message.channel.send({
          files: [message.content.match(imageUrlPattern)[0]],
        })
      : message.reply("Tidak ada URL gambar yang ditemukan dalam pesan.");
}
