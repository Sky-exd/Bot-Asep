import { SlashCommandBuilder } from "discord.js";
import { OpenAI } from "openai";
import { config } from "../config.js";

const openai = new OpenAI({
  apiKey: config.openaiKEY,
});

/** @type {import('commandkit').CommandData} */
export const data = new SlashCommandBuilder()
  .setName("chatgpt")
  .setDescription("Tanya Apa Ke Asep?")
  .addStringOption((option) =>
    option
      .setName("pertanyaan")
      .setDescription("Mau Tanya Apa ke Asep?")
      .setRequired(true),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  if (!interaction.deferred) await interaction.deferReply();
  const pertanyaan = interaction.options.getString("pertanyaan");
  const responAI = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          // name:
          role: "system",
          content: "Chat GPT teman chat mu",
        },
        {
          // name:
          role: "user",
          content: pertanyaan,
        },
      ],
    })
    .catch((err) => {
      interaction.editReply({
        content: "Asep AI sedang pusing bang sabar !",
      });
      console.error("OpenAI Error \n", err);
      return;
    });

  await interaction.editReply(responAI.choices[0].messages.content);
};

/** @type {import('commandkit').CommandOptions} */
export const options = {};
