import {
  Client,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} from "discord.js";
import { RankCardBuilder, Font } from "canvacord";
import calculateLevelXp from "../../utils/calculateLevelXp.js";
import Level from "../../models/Level.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const data = {
  name: "level",
  description: "Shows your/someone's level.",
  options: [
    {
      name: "target-user",
      description: "The user whose level you want to see.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};

/**
 * @param {Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 */
export const run = async ({ interaction }) => {
  try {
    await interaction.deferReply();

    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again.",
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp",
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const poppinsBold = readFileSync(
      `${__dirname}/../../../assets/fonts/Poppins/Poppins-Bold.ttf`,
    );
    const fonts = new Font(poppinsBold, "poppins-bold");

    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus(
        targetUserObj.presence ? targetUserObj.presence.status : "offline",
      )
      .setUsername(targetUserObj.user.username)
      .setFonts(fonts);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    await interaction.editReply({ files: [attachment] });
  } catch (error) {
    console.error("An error occurred:", error);
    interaction.editReply("An error occurred while processing the command.");
  }
};
