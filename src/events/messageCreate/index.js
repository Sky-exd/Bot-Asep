import { badWords, balesPesan, responses } from "../../config.js";

export default async function (message, client) {
  if (message.author.bot) return;
  if (message.channel.type === "dm")
    return message.reply("Maaf, saya tidak bisa membaca pesan di DM.");
  if (message.mentions.has(client.user)) message.reply("Kenapa Bang?");

  const msg = message.content.toLowerCase();

  // otomatis balas pesan
  for (const data of balesPesan)
    if (msg === data.pesan) message.reply(data.balesan);

  if (badWords.some((word) => msg.includes(word))) {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    message.reply(randomResponse);
  }
}
