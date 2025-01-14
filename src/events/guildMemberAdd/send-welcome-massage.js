import WelcomeChannelSchema from "../../models/WelcomeChanel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage } from "canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (guildMember) => {
  try {
    if (guildMember.user.bot) return;

    const welcomeConfigs = await WelcomeChannelSchema.find({
      guildId: guildMember.guild.id,
    });
    if (!welcomeConfigs) return;

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
    }
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
};
