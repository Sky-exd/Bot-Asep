import { SlashCommandBuilder } from "discord.js";

/** @type {import('commandkit').CommandData} */
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Say Hai To Bot !");

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, client, handler }) => {
  await interaction.reply("Terimkasih telah menghubungi asep ... !");
  handler.reloadCommands();
};

/** @type {import('commandkit').CommandOptions} */
export const options = {};
