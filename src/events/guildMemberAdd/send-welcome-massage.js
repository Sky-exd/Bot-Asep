<<<<<<< HEAD
import WelcomeChannelSchema from "../../models/WelcomeChanel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage } from "canvas";
=======
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { fileURLToPath } from "url";
import { AttachmentBuilder } from "discord.js";
import embedBase from "../../utils/embeds.js";
import WelcomeLeave from "../../utils/WelcomeLeaveCanvas.js";
>>>>>>> 4ee5f4eadea627476b5c579322010f1fd403a251

const __filename = fileURLToPath(import.meta.url);

<<<<<<< HEAD
export default async (guildMember) => {
=======
const bannerWelcome =
  "https://i.pinimg.com/736x/7e/bf/a6/7ebfa6019cd7901d143aac632467e7a7.jpg";

/**
 * @param {import('discord.js').GuildMember} guildMember
 */
export default async function (guildMember) {
>>>>>>> 4ee5f4eadea627476b5c579322010f1fd403a251
  try {
    if (guildMember.user.bot) return;

    const welcomeConfigs = await WelcomeChannelSchema.find({
      guildId: guildMember.guild.id,
    });
    if (!welcomeConfigs) return;
<<<<<<< HEAD

    for (const welcomeConfig of welcomeConfigs) {
      const targetChannel =
        guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
        (await guildMember.guild.channels.fetch(welcomeConfig.channelId));
      if (!targetChannel) {
        WelcomeChannelSchema.findOneAndDelete({
          guildId: guildMember.guild.id,
          channelId: welcomeConfig.channelId,
        }).catch(() => {});
      }

      const customMessage =
        welcomeConfig.customMessage ||
        "Hello {mention-member}, welcome to {server-name}!";

      const welcomeMessage = customMessage
        .replace("{mention-member}", `<@${guildMember.id}>`)
        .replace("{username}", guildMember.user.username)
        .replace("{server-name}", guildMember.guild.name);

      const canvas = createCanvas(700, 250);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#7289DA";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `welcome ${guildMember.displayName}`,
        canvas.width / 2.5,
        canvas.height / 1.8
      );

      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await loadImage(
        guildMember.user.displayAvatarURL({
          extentions: "png",
        })
      );
      ctx.drawImage(avatar, 25, 25, 200, 200);

      const attachment = new AttachmentBuilder(
        canvas.toBuffer(),
        "welcome-image.png"
      );
      channel.send("selamat datang di server, ${member}!");

      targetChannel.send(welcomeMessage).catch(() => {});
=======

    for (const welcomeConfig of welcomeConfigs) {
      const targetChannel =
        guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
        (await guildMember.guild.channels.fetch(welcomeConfig.channelId));
      if (!targetChannel) {
        WelcomeChannelSchema.findOneAndDelete({
          guildId: guildMember.guild.id,
          channelId: welcomeConfig.channelId,
        }).catch((error) => {
          console.error(error);
          targetChannel.send({
            embeds: [
              embedBase({
                type: "error",
                message: "tidak ditemukan channel nya bang",
              }),
            ],
          });
          return;
        });
      }

      const customMessage =
        welcomeConfig.customMessage ||
        "Hello {display-member}, welcome to {server-name}!";

      const welcomeMessage = customMessage
        .replace("{mention-member}", `<@${guildMember.id}>`)
        .replace("{display-name}", guildMember.user.displayName)
        .replace("{username}", guildMember.user.username)
        .replace("{server-name}", guildMember.guild.name);

      const WelcomeCanvas = await new WelcomeLeave()
        .setAvatar(
          guildMember.user.displayAvatarURL({
            forceStatic: true,
            extension: "png",
          }),
        )
        .setBackground("image", bannerWelcome)
        .setTitle("Selamat Datang")
        .setDescription(welcomeMessage, "#FBFBFB")
        .setAvatarBorder("#3C3D37")
        .setOverlayOpacity(0.5)
        .build();

      const attachment = new AttachmentBuilder(WelcomeCanvas, {
        name: `welcome-${guildMember.id}.png`,
      });
      targetChannel.send({
        content: `Halo ${guildMember.user.username}!, Semoga Betah di Server ${guildMember.guild.name}!`,
        files: [attachment],
      });
>>>>>>> 4ee5f4eadea627476b5c579322010f1fd403a251
    }
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
<<<<<<< HEAD
};
=======
}
>>>>>>> 4ee5f4eadea627476b5c579322010f1fd403a251
