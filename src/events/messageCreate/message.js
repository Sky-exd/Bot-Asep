import { responses } from "../../config.js";
import autorespon from "../../models/AutoResponModel.js";
import banKataModel from "../../models/bankataModel.js";
import { logger } from "../../logger.js";

export default async function (message, client) {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) message.reply("Kenapa Bang?");

  const guildId = message.guild.id;
  const msg = message.content.toLowerCase();

  // otomatis balas pesan
  try {
    const dataPesan = await autorespon.findOne({ guildId: guildId });
    if (!dataPesan) return;
    for (const data of dataPesan.autorespon) {
      const pesan = data.pesan;
      const balesan = data.balesan;
      if (msg === pesan) {
        message.reply(balesan);
      }
    }
  } catch (error) {
    logger.error(error, "Gagal dalam merespon pesan otomatis");
  }

  // ban kata kasar
  try {
    const katakasar = await banKataModel.find({ guildId });
    const kata = katakasar.some((kata) =>
      msg.includes(kata.word.toLowerCase()),
    );
    if (kata) {
      message.delete();
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      message.channel.send({
        content: randomResponse,
      });
    }
  } catch (err) {
    logger.error(err, "Gagal dalam mengecek kata kasar!");
  }
}
