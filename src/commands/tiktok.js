import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tempDir = path.join(__dirname, "../../../temp/");

const downloadFileTiktok = async (urlVideo, dest) => {
  let file = fs.createWriteStream(dest);
  let resp = await axios({
    method: "GET",
    url: urlVideo,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    var responseSent = false;
    resp.data.pipe(file);
    file.on("finish", () => {
      file.on("error", (err) => {
        reject(err);
      });
      file.on("close", () => {
        if (responseSent) return;
        responseSent = true;
        resolve();
      });
    });
  });
};

export const data = new SlashCommandBuilder()
  .setName("sendvt")
  .setDescription("Kirim video tiktok")
  .addStringOption((options) =>
    options
      .setName("url")
      .setDescription("https://vt.tiktok.com/ZSjMk4GRw/")
      .setRequired(true),
  );
/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction }) {
  const urlTikok = interaction.options.getString("url");
  await interaction.deferReply();
  await interaction.editReply({
    content: "Tunggu bentar yaa lagi prosess... ",
  });
  const tiktokDownloader = await Downloader(urlTikok, { version: "v2" });
  if (tiktokDownloader.status === "error") {
    return await interaction.editReply({
      content: "Link Tiktok ada yang salah bang !",
    });
  }

  if (typeof tiktokDownloader.result === "undefined") {
    return await interaction.editReply({
      content: "Gagal download tiktok nya bang !",
    });
  }

  if (tiktokDownloader.result.type === "video") {
    let nameFileTemp = `tempTiktok${Math.ceil(
      Math.random() * 5000,
    )}_tiktok.mp4`;
    let tempFile = path.join(tempDir, nameFileTemp);
    try {
      await downloadFileTiktok(tiktokDownloader.result.video, tempFile);
      let stats = fs.statSync(tempFile);
      stats.size = Math.round(stats.size / 1024);
      if (stats.size < 9) {
        return interaction.editReply("tiktok gagal di send").then(() => {
          setTimeout(() => {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
          }, 3000);
        });
      }
      const tiktokVideo = new AttachmentBuilder()
        .setFile(tempFile)
        .setName("tiktok-video.mp4");

      return await interaction.editReply({ files: [tiktokVideo] }).then(() => {
        setTimeout(() => {
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }, 3000);
      });
    } catch (err) {
      console.error(err);
      return await interaction
        .editReply({
          content: "Ada yang salah sama download file nya",
        })
        .then(() => {
          setTimeout(() => {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
          }, 3000);
        });
    }
  } else {
    return await interaction.editReply("Belom di dukung bang");
  }
}
export const options = {};
