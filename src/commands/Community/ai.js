import { ApplicationCommandOptionType, ApplicationCommandType, MessageFlags } from "discord.js";
import { config } from "../../config.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import create from "../../utils/embeds.js";

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
export const data = {
  name: "tanyaasep",
  description: "Tanya Apapun ke AsepAI",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "pertanyaan",
      description: "Silakan Mau tanya apa?",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
}
/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  const pertanyaan = interaction.options.getString("pertanyaan");
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  try {
    const geminiAI = new GoogleGenerativeAI(config.geminiAPIKey);
    const modelGemini = geminiAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chat = modelGemini.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: [],
    });
    const result = await chat.sendMessage(pertanyaan);
    if (result.error) {
      console.error("Gemini AI ERROR Coba lagi nanti");
      return await interaction.editReply({
        embeds: [
          create({
            type: "error",
            message: "Asep AI Sedang ada yang error! coba lagi nanti ",
          }),
        ],
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
    return interaction.editReply({
      embeds: [
        create({
          type: "error",
          message:
            "Ada yang salah dengan ai gemini! Tolong Lapor pembuat nya!",
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
};

/** @type {import('commandkit').CommandOptions} */
// export const options = {};
