import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { translate, languages, getCode } from "google-translate-api-x";
import { listISOCountry } from "../../config.js";
import { logger } from "../../logger.js";
import EmbedBase from "../../utils/embeds.js";

const listBahasa = [];
for (const [iso, country] of Object.entries(listISOCountry)) {
  listBahasa.push({
    country: country,
    iso: iso,
  });
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "translate",
  description: "Translate bahasa biar lebih mudah berkomunikasi",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "kalimat",
      description: "Kalimat yang mau di translate",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "ke",
      description: "Ke Bahasa apa ?",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction, client }) {
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  const kalimat = interaction.options.getString("kalimat");
  const keBahasa = interaction.options.getString("ke");
  logger.info(`${interaction.user.tag} meminta translate kalimat`);

  try {
    logger.info(`Menerjemahkan kalimat dari ${kalimat} ke ${keBahasa}`);
    const { text, from } = await translate(kalimat, { to: keBahasa });
    await interaction.editReply({
      embeds: [
        new EmbedBase({
          client,
          title: "Hasil Translate",
        }).addFields(
          {
            name: `${languages[getCode(from.language.iso)]}`,
            value: kalimat,
            inline: true,
          },
          {
            name: `${languages[getCode(keBahasa)]}`,
            value: text,
            inline: true,
          },
        ),
      ],
    });
    logger.info(
      `Berhasil menerjemahkan kalimat dari ${kalimat} ke ${keBahasa}`,
    );
    return;
  } catch (err) {
    logger.error(
      `${interaction.user.tag} memasukan bahasa yang tidak tersedia`,
    );
    console.error(err);
    await interaction.editReply({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          title: "Gagal Translate!!",
          message:
            "Silakahn Pilih Bahasa yang tersedia ! jangan cari yang gada yaa",
        }),
      ],
    });
    return;
  }
}

/** @param {import('commandkit').AutocompleteProps} param0 */
export async function autocomplete({ interaction }) {
  const focusedOptions = interaction.options.getFocused();
  const pilihBahasa = listBahasa.filter((bhs) =>
    bhs.country.toLowerCase().startsWith(focusedOptions),
  );
  const hasil = pilihBahasa.map((bhs) => {
    return {
      name: capitalizeFirstLetter(bhs.country),
      value: bhs.iso,
    };
  });
  await interaction.respond(hasil.slice(0, 25));
}
