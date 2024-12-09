import { SlashCommandBuilder } from "discord.js";
import { config } from "../config.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const GENERATION_CONFIG = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/** @type {import('commandkit').CommandData} */
export const data = new SlashCommandBuilder()
  .setName("tanyaasep")
  .setDescription("Tanya apa ke asep?")
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
  try {
    const geminiAI = new GoogleGenerativeAI(config.geminiAPIKey);
    const modelGemini = geminiAI.getGenerativeModel({
      model: "gemini-1.0-pro",
    });
    const chat = modelGemini.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: [],
    });
    const result = await chat.sendMessage(pertanyaan);
    if (result.error) {
      console.error("Gemini AI ERROR Coba lagi nanti", err);
      return await interaction.editReply({
        content: "Asep AI Sedang ada yang error! coba lagi nanti ",
      });
    }
    const respon = result.response.text();
    const chunkMessageLimit = 2000;
    for (let i = 0; i < respon.length; i += chunkMessageLimit) {
      const pesan = respon.substring(i, i + chunkMessageLimit);
      await interaction.followUp({ content: pesan });
    }
  } catch (err) {
    console.error(err);
    await interaction.reply("ada yang error bang sama ai nya sabar !");
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {};
