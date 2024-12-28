import {
  AttachmentBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { statSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../../logger.js";
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
  logger.info(`${interaction.user.tag} meminta video tiktok`);
  const urlTikok = interaction.options.getString("url");
  const tiktokDownloader = await Downloader(urlTikok, { version: "v2" });
  if (tiktokDownloader.status === "error" || typeof tiktokDownloader.result === "undefined") {
    logger.error(`${interaction.user.tag} memasuukan link tiktok yang salah`);
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
        logger.info(`Mengunduh video tiktok dari ${interaction.user.tag}`);
        await downloadFile(
          tiktokDownloader.result.video,
          tempFile,
        );
        const size = statSync(tempFile).size
        if (size >= 100 * 1024 * 1024 || size >= 25 * 1024 * 1024 || size < 9) {
          logger.error(`File terlalu besar atau terlalu kecil`);
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
          await interaction.editReply({
            files: [tiktokVideo],
          });
          logger.success(`Video tiktok dari ${interaction.user.tag} berhasil dikirim`);
        } catch (error) {
          console.error(error);
          logger.error(`Gagal mengirim video tiktok dari ${urlTikok}`);
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
        logger.error(`Kesalahan dalam mengunduh video tiktok dari ${urlTikok}`);
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
      const AttachFiles = []
      const linkImages = tiktokDownloader.result.images
      const linkMusic = tiktokDownloader.result.music
      linkImages.forEach((image, index) => {
        const nameFileTemp = `tiktok-image${index}.jpg`;
        AttachFiles.push(new AttachmentBuilder(image, { name: nameFileTemp }))
      })
      console.log(linkMusic);
      await interaction.editReply({
        files: AttachFiles
      });
      break;
    }
  }
};
