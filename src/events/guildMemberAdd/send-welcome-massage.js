import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { fileURLToPath } from "url";
import { AttachmentBuilder } from "discord.js";
import embedBase from "../../utils/embeds.js";
import WelcomeLeave from "../../utils/WelcomeLeaveCanvas.js";
import { logger } from "../../logger.js";

const __filename = fileURLToPath(import.meta.url);

const bannerWelcome =
  "https://i.pinimg.com/736x/7e/bf/a6/7ebfa6019cd7901d143aac632467e7a7.jpg";

/**
 * @param {import('discord.js').GuildMember} guildMember
 */
export default async function (guildMember) {
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
      await targetChannel.send({
        content: `Halo ${guildMember.user.username}!, Semoga Betah di Server ${guildMember.guild.name}!`,
        files: [attachment],
      });
      logger.info(`${guildMember.user.username}! Masuk Guild Bang!`);
    }
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
}
