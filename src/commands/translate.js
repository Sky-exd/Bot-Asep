import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { translate } from "google-translate-api-x";
import { listBahasa } from "../config.js";

const ppdc =
  "https://i.pinimg.com/736x/50/70/8a/50708afb9456ecbb834f1bf6a82b319f.jpg";

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
  const bahasa = listBahasa.find((fd) => fd.value === keBahasa);
  await interaction.deferReply();

  try {
    const { text, from } = await translate(kalimat, { to: keBahasa });
    const teksBahasa = listBahasa.find((fd) => fd.value === from.language.iso);

    const embedHasil = new EmbedBuilder()
      .setAuthor({
        name: "Asep cihuy",
        iconURL: ppdc,
      })
      .setTitle("Hasil Translate")
      .addFields(
        {
          name: `${capitalizeFirstLetter(teksBahasa.name)}`,
          value: kalimat,
          inline: true,
        },
        {
          name: `${capitalizeFirstLetter(bahasa.name)}`,
          value: text,
          inline: true,
        },
      )
      .setColor(0x00b0f4)
      .setFooter({
        text: "Terimakasih telah memakai bot Asep!",
        iconURL: ppdc,
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embedHasil] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({
      content: "Gagal Translate bang ! Coba lagi nanti",
    });
  }
}

/** @param {import('commandkit').AutocompleteProps} param0 */
export async function autocomplete({ interaction }) {
  const focusedOptions = interaction.options.getFocused();
  const pilihBahasa = listBahasa.filter((bhs) =>
    bhs.name.toLowerCase().startsWith(focusedOptions),
  );
  const hasil = pilihBahasa.map((bhs) => {
    return {
      name: capitalizeFirstLetter(bhs.name),
      value: bhs.value,
    };
  });
  await interaction.respond(hasil.slice(0, 25));
}

/** @type {import('commandkit').CommandOptions} */
export const options = {};
