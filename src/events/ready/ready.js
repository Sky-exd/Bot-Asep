import mongoose from "mongoose";
import logger from "../../logger.js";
import { config } from "../../config.js";

const { mongodbURI } = config;

export default async function (client) {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongodbURI);
    logger.info(`Bot ${client.user.tag} sudah ready bang !`);
    logger.success(`Bot Berhasil terhubung ke database!`)
  } catch (error) {
    logger.error(`Tidak Berhasil Terhubung ke database`);
    console.error(error);
  }
}
