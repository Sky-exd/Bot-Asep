import mongoose from "mongoose";
import { config } from "../../config.js";
import { logger } from "../../logger.js";

const { mongodbURI } = config;

export default async function (client) {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongodbURI);
    logger.info("Bot Sudah logging ...");
    logger.info(`Bot ${client.user.tag} sudah ready bang !`);
    logger.info(`Bot Berhasil terhubung ke database!`);
  } catch (error) {
    logger.error(error, `Tidak Berhasil Terhubung ke database`);
  }
}
