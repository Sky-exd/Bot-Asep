import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { config } from "../../config.js";
import { logger } from "../../logger.js";
import EmbedBase from "../../utils/embeds.js";

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
      required: true,
    },
  ],
};
/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, client }) => {
  await interaction.deferReply();
  logger.info(`${interaction.user.tag} tanya ke AsepAI`);
  const pertanyaan = interaction.options.getString("pertanyaan");
  try {
    logger.info(`Mengirim pertanyaan ke AsepAI`);
    const geminiAI = new GoogleGenerativeAI(config.geminiAPIKey);
    const modelGemini = geminiAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });
    const chat = modelGemini.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: [],
    });
    const result = await chat.sendMessage(pertanyaan);
    if (result.error) {
      logger.error(`AsepAI Sedang ada yang error!`);
      await interaction.editReply({
        embeds: [
          new EmbedBase({
            client,
            type: "error",
            message: "Asep AI Sedang ada yang error! coba lagi nanti ",
          }),
        ],
      });
      return;
    }
    const respon = result.response.text();
    const chunkMessageLimit = 2000;
    for (let i = 0; i < respon.length; i += chunkMessageLimit) {
      const pesan = respon.substring(i, i + chunkMessageLimit);
      await interaction.followUp({ content: pesan });
    }
    logger.info(`AsepAI Berhasil menjawab pertanyaan`);
  } catch (err) {
    logger.error(err, `AsepAI otak nya konslet!`);
    await interaction.editReply({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          message: "Ada yang salah dengan ai gemini! Tolong Lapor pembuat nya!",
        }),
      ],
    });
    return;
  }
};

/** @type {import('commandkit').CommandOptions} */
// export const options = {};
