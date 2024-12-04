import { SlashCommandBuilder } from "discord.js";

/** @type {import('commandkit').CommandData} */
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Nyapa Bot !");

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  await interaction.reply("Terimkasih telah menghubungi asep 😎!");
};

/** @type {import('commandkit').CommandOptions} */
export const options = {};
