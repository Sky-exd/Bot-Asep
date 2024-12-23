import { badWords, balesPesan, responses } from "../../config.js";
import banKataModel from "../../models/bankataModel.js";

export default async function (message, client) {
  if (message.author.bot) return;
  if (message.channel.type === "dm")
    return message.reply("Maaf, saya tidak bisa membaca pesan di DM.");
  if (message.mentions.has(client.user)) message.reply("Kenapa Bang?");

  const guildId = message.guild.id;
  const msg = message.content.toLowerCase();

  // otomatis balas pesan
  for (const data of balesPesan)
    if (msg === data.pesan) message.reply(data.balesan);

  try {
    const katakasar = await banKataModel.find({ guildId });
    const kata = katakasar.some(kata => msg.includes(kata.word.toLowerCase()));
    if (kata) {
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      message.reply(randomResponse);
    }

  } catch (err) {
    console.error("Gagal mengecek kata kasar", err);
  }

  // if (badWords.some((word) => msg.includes(word))) {
  //   const randomResponse =
  //     responses[Math.floor(Math.random() * responses.length)];
  //   message.reply(randomResponse);
  // }
}
