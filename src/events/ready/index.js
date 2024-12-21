
import logger from "../../logger.js";

export default function (client) {
  logger.info(`Bot ${client.user.tag} sudah ready bang !`);
  logger.info(`Bot ini menggunakan ${client.guilds.cache.size} server dan ${client.users.cache.size} pengguna.`);
}
