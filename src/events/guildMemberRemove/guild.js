import { logger } from "../../logger.js";
/**
 * @param {import('discord.js').GuildMember} guildMember
 */
export default async function (guildMember) {
  try {
    console.log("Ada yang keluar guild bang!");
  } catch (error) {
    logger.error(error, "Terjadi Kesalahan pada sistem!");
  }
}
