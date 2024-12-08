import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { translate, languages, getCode } from "google-translate-api-x";
import { listISOCountry } from "../config.js";

const listBahasa = [];
for (const [iso, country] of Object.entries(listISOCountry)) {
  listBahasa.push({
    country: country,
    iso: iso,
  });
}

const ppdc =
  "https://i.pinimg.com/736x/2e/da/3f/2eda3f3eab9214d29dd3f671dbda36ec.jpg";

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const data = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate bahasa biar lebih mudah")
  .addStringOption((option) =>
    option
      .setName("kalimat")
      .setDescription("Kalimat yang mau di translate !")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("ke")
      .setDescription("Ke Bahasa apa ?")
      .setRequired(true)
      .setAutocomplete(true),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction }) {
  const kalimat = interaction.options.getString("kalimat");
  const keBahasa = interaction.options.getString("ke");
  await interaction.deferReply();

  try {
    const { text, from } = await translate(kalimat, { to: keBahasa });

    const embedHasil = new EmbedBuilder()
      .setAuthor({
        name: "Uciha Asep",
        iconURL: ppdc,
      })
      .setTitle("Hasil Translate")
      .addFields(
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
      )
      .setColor(0x00b0f4)
      .setFooter({
        text: "Terimakasih telah memakai jasa kami!",
        iconURL: ppdc,
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embedHasil] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "Uciha Asep", iconURL: ppdc })
          .setTitle("Failed Translate")
          .setDescription("Gagal Translate Bang! Silakan coba lagi nantii")
          .setColor(0xf72c5b),
      ],
    });
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
