import { SlashCommandBuilder } from "discord.js";

/** @type {import('commandkit').CommandData} */
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping pong");

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  await interaction.reply("pong");
};

/** @type {import('commandkit').CommandOptions} */
export const options = {};
