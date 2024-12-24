import { responses } from "../../config.js";
import autorespon from "../../models/AutoResponModel.js";
import banKataModel from "../../models/bankataModel.js";

export default async function (message, client) {
  if (message.author.bot) return;
  if (message.channel.type === "dm")
    return message.reply("Maaf, saya tidak bisa membaca pesan di DM.");
  if (message.mentions.has(client.user)) message.reply("Kenapa Bang?");

  const guildId = message.guild.id;
  const msg = message.content.toLowerCase();

  // otomatis balas pesan
  try {
    const data = await autorespon.findOne({ guildId: guildId });
    if (!data) return;
    for (const d of data.autorespon) {
      const pesan = d.pesan;
      const balesan = d.balesan;
      if (msg === pesan) {
        message.reply(balesan)
      }
    }
  } catch (error) {
    console.error(error)
  }


  // ban kata kasar
  try {
    const katakasar = await banKataModel.find({ guildId });
    const kata = katakasar.some(kata => msg.includes(kata.word.toLowerCase()));
    if (kata) {
      message.delete();
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      message.channel.send({
        content: randomResponse,
      });
    }

  } catch (err) {
    console.error("Gagal mengecek kata kasar", err);
  }
}
