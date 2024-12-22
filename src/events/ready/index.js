import mongoose from "mongoose";
import logger from "../../logger.js";
import { config } from "../../config.js";

export default async function (client) {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.mongodbURI);
    logger.info(`Bot Berhasil terhubung ke database!`)
    logger.info(`Bot ${client.user.tag} sudah ready bang !`);
    logger.info(`Bot ini menggunakan ${client.guilds.cache.size} server dan ${client.users.cache.size} pengguna.`);
    logger.info(`Bot ini menggunakan ${client.channels.cache.size} channel.`);
  } catch (error) {
    logger.error(`Tidak Berhasil Terhubung ke database`);
    console.error(error);
  }
}
