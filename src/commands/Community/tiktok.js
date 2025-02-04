import {
  AttachmentBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { statSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "../../logger.js";
import downloadFile from "../../utils/downloadFile.js";
import EmbedBase from "../../utils/embeds.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tempDir = join(__dirname, "../../../temp");

// Fungsi untuk memvalidasi URL TikTok
function isValidTikTokUrl(url) {
  const TiktokURLregex =
    /https:\/\/(?:m|www|vm|vt|lite)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;
  return TiktokURLregex.test(url);
}

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "kirimtiktok",
  description: "Kirim video tiktok",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "url",
      description:
        "Masukkan URL TikTok (contoh: https://vt.tiktok.com/ZSjMk4GRw/)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction, client }) {
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply();
  }

  const urlTikTok = interaction.options.getString("url");

  // Validasi URL TikTok
  if (!isValidTikTokUrl(urlTikTok)) {
    logger.error(
      `${interaction.user.tag} memasukkan link TikTok yang tidak valid`,
    );
    return interaction.editReply({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          message:
            "Link TikTok tidak valid! Pastikan link yang dimasukkan benar.",
        }),
      ],
    });
  }

  logger.info(`${interaction.user.tag} mengirim sebuah link tiktok`);

  try {
    const tiktokDownloader = await Downloader(urlTikTok, { version: "v2" });

    if (tiktokDownloader.status === "error" || !tiktokDownloader.result) {
      logger.error(`${interaction.user.tag} memasukkan link TikTok yang salah`);
      await interaction.editReply({
        embeds: [
          new EmbedBase({
            client,
            type: "error",
            message:
              "Link TikTok tidak valid atau terjadi kesalahan saat memproses!",
          }),
        ],
      });
      return;
    }

    const result = tiktokDownloader.result;

    switch (result.type) {
      case "video": {
        const nameFileTemp = `tiktok_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp4`;
        const tempFile = join(tempDir, nameFileTemp);

        try {
          logger.info(`Mengunduh video TikTok dari ${interaction.user.tag}`);
          await downloadFile(result.video, tempFile);

          const size = statSync(tempFile).size;

          if (size >= 100 * 1024 * 1024 || size < 1024) {
            await interaction.editReply({
              embeds: [
                new EmbedBase({
                  client,
                  type: "error",
                  message:
                    "File terlalu besar (maksimal 100MB) atau terlalu kecil!",
                }),
              ],
            });
            logger.error("File Terlalu Besar Gagal di proses");
            return;
          }

          const tiktokVideo = new AttachmentBuilder(tempFile, {
            name: "tiktokVideo.mp4",
          });

          await interaction.editReply({
            files: [tiktokVideo],
          });
          logger.info(`Berhasil mengirim video tiktok!`);
        } catch (error) {
          logger.error(
            error,
            `Gagal mengunduh atau mengirim video TikTok: ${error.message}`,
          );
          await interaction.editReply({
            embeds: [
              new EmbedBase({
                client,
                type: "error",
                message: "Gagal mengunduh atau mengirim video TikTok!",
              }),
            ],
          });
        } finally {
          if (existsSync(tempFile)) {
            unlinkSync(tempFile);
          }
        }
        break;
      }

      case "image": {
        logger.info("Memperoses Tiktok Gambar");
        const linkImages = result.images;
        const batchSize = 10;

        try {
          for (let i = 0; i < linkImages.length; i += batchSize) {
            const batch = linkImages.slice(i, i + batchSize);
            const attachments = batch.map((file, index) => {
              return new AttachmentBuilder(file, {
                name: `tiktokImage_${i + index}.jpg`,
              });
            });

            logger.info("Mengirim tiktok gambar");
            if (attachments.length > 0) {
              await interaction.followUp({
                files: attachments,
              });
            }
          }
        } catch (error) {
          logger.error(error, `Gagal mengirim gambar TikTok`);
          await interaction.followUp({
            embeds: [
              new EmbedBase({
                client,
                type: "error",
                message: "Gagal mengirim gambar TikTok!",
              }),
            ],
          });
        }
        break;
      }

      default: {
        logger.error(`Tipe konten TikTok tidak dikenali: ${result.type}`);
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              type: "error",
              message: "Tipe konten TikTok tidak dikenali!",
            }),
          ],
        });
        break;
      }
    }
  } catch (error) {
    logger.error(error, `Terjadi kesalahan saat memproses permintaan TikTok`);
    await interaction.editReply({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          message: "Terjadi kesalahan saat memproses permintaan TikTok!",
        }),
      ],
    });
  }
}
