import {
  AttachmentBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import embedbase from "../../utils/embeds.js";
import create from "../../utils/embeds.js";
import { finished, Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "../../../temp");

const downloadFile = async (url, fileName) => {
  const response = await fetch(url)
  const tujuanFile = path.join(tempDir, fileName)
  const fileStream = fs.createWriteStream(tujuanFile, { flags: "w" })
  finished(Readable.fromWeb(response.body).pipe(fileStream))
  fileStream.on('error', () => {
    throw Error('Gagal Download Bang!')
  })
}

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "kirimtiktok",
  description: "Kirim video tiktok",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "url",
      description: "https://vt.tiktok.com/ZSjMk4GRw/",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction }) {
  try {
    const urlTikok = interaction.options.getString("url");
    const tiktokDownloader = await Downloader(urlTikok, { version: "v2" });
    if (!interaction.deferred && !interaction.replied)
      await interaction.deferReply();
    if (tiktokDownloader.status === "error") {
      return interaction.editReply({
        embeds: [
          embedbase({
            type: "error",
            message: "Link Tiktok ada yang salah bang !",
          }),
        ],
      });
    }
    if (typeof tiktokDownloader.result === "undefined") {
      return interaction.editReply({
        embeds: [
          embedbase({
            type: "error",
            message: "Gagal download tiktok nya bang !",
          }),
        ],
      });
    }
    switch (tiktokDownloader.result.type) {
      case "video": {
        const nameFileTemp = `tiktok${Math.ceil(Math.random() * 5000)}_temp.mp4`;
        const tempFile = path.join(tempDir, nameFileTemp);
        try {
          await downloadFile(
            tiktokDownloader.result.video,
            nameFileTemp,
          );
          const size = fs.statSync(tempFile).size
          if (size >= 100 * 1024 * 1024 || size >= 25 * 1024 * 1024) {
            return await interaction.editReply({
              embeds: [create({
                type: "error",
                message: "File terlalu besar bang !"
              })]
            })
          }
          try {
            const tiktokVideo = new AttachmentBuilder(tempFile, {
              name: "tiktok-video.mp4",
            });
            return await interaction.editReply({
              files: [tiktokVideo],
            });
          } catch (error) {
            console.error(error);
            await interaction.editReply({
              embeds: [
                embedbase({
                  type: "error",
                  message: "Tiktok Gagal Di Kirim Bang! Coba lagi nanti!",
                }),
              ],
            });
          }
        } catch (err) {
          console.error(err);
          return await interaction
            .editReply({
              embeds: [
                embedbase({
                  type: "error",
                  message: "Ada yang salah sama download file nya",
                }),
              ],
            })
        } finally {
          setTimeout(() => {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
          }, 3000);
        }
        break;
      }
      case "image": {
        await interaction.editReply({
          embeds: [
            embedbase({
              type: "info",
              message: "tiktok gambar belom di dukung bang!",
            })
          ]
        });
        break;
      }
      default:
        return await interaction.editReply({
          embeds: [
            embedbase({
              type: "error",
              message: "Tipe Video Tidak Ditemukan bang !!",
            }),
          ],
        });
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    if (!interaction.replied) {
      return await interaction.editReply({
        embeds: [
          embedbase({
            type: "error",
            message:
              "Terjadi kesalahan saat memproses permintaan.",
          }),
        ]
      });
    }
  }
};
