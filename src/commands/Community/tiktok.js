import {
  AttachmentBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { statSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import embedbase from "../../utils/embeds.js";
import downloadFile from "../../utils/downloadFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tempDir = join(__dirname, "../../../temp");

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
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  const urlTikok = interaction.options.getString("url");
  const tiktokDownloader = await Downloader(urlTikok, { version: "v2" });
  if (tiktokDownloader.status === "error" || typeof tiktokDownloader.result === "undefined") {
    return interaction.editReply({
      embeds: [
        embedbase({
          type: "error",
          message: "Link Tiktok ada yang salah bang !",
        }),
      ],
    });
  }
  switch (tiktokDownloader.result.type) {
    case "video": {
      const nameFileTemp = `tiktok${Math.ceil(Math.random() * 5000)}_temp.mp4`;
      const tempFile = join(tempDir, nameFileTemp);
      try {
        await downloadFile(
          tiktokDownloader.result.video,
          tempFile,
        );
        const size = statSync(tempFile).size
        if (size >= 100 * 1024 * 1024 || size >= 25 * 1024 * 1024 || size < 9) {
          return await interaction.editReply({
            embeds: [embedbase({
              type: "error",
              message: "File nya terlalu besar tidak bisa dikirim!!"
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
          if (existsSync(tempFile)) unlinkSync(tempFile);
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
};
