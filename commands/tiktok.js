const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { Downloader } = require("@tobyg74/tiktok-api-dl");
const axios = require("axios");
const fs = require("fs");

const TiktokURLregex =
  /https:\/\/(?:m|www|vm|vt|lite)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;

const downloadFileTiktok = async (urlVideo, dest) => {
  let file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: urlVideo,
      responseType: "stream",
    }).then((resp) => {
      var responseSent = false;
      resp.data.pipe(file);
      file.on("finish", () => {
        file.on("close", () => {
          if (responseSent) return;
          responseSent = true;
          resolve();
        });
      });
    });
  });
};

module.exports = {
  run: async (client, interaction) => {
    let urlMatch = interaction.options.getString("url");
    if (urlMatch.match(TiktokURLregex)) {
      interaction.deferReply().then(() => {
        const linkTiktok = Downloader(urlMatch, { version: "v2" });
        linkTiktok.then(async (rsult) => {
          if (rsult.result.type === "video") {
            let tempFile = `tempTiktok${Math.ceil(
              Math.random() * 5000,
            )}_tiktok.mp4`;
            try {
              await downloadFileTiktok(rsult.result.video, tempFile);
              let stats = fs.statSync(tempFile);
              stats.size = Math.round(stats.size / (1024 * 1024));
              if (stats.size > 9) {
                fs.unlinkSync(tempFile);
                interaction.editReply("tiktok gagal di send");
              }
              const tiktokVideo = new AttachmentBuilder()
                .setFile(tempFile)
                .setName("tiktok-video.mp4");

              interaction.editReply({ files: [tiktokVideo] }).then(async () => {
                fs.unlinkSync(tempFile);
              });
            } catch (error) {
              console.log(error);
              if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
              interaction.editReply("Ada yang salah bang bentar");
            }
          } else if (rsult.result.type === "image") {
            interaction.editReply({ content: "belom didukung" });
          }
        });
      });
    } else {
      interaction.reply("link tiktok salah bang").then(() => {
        setTimeout(() => {
          interaction.deleteReply();
        }, 5000);
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("sendvt")
    .setDescription("Kirim video tiktok")
    .addStringOption((options) =>
      options
        .setName("url")
        .setDescription("https://vt.tiktok.com/ZSjMk4GRw/")
        .setRequired(true),
    ),
};
