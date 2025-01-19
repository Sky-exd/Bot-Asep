import { SlashCommandBuilder, spoiler } from "discord.js";
import banKataModel from "../../models/bankataModel.js";
import embedBase from "../../utils/embeds.js";

export const data = new SlashCommandBuilder()
  .setName("bankata")
  .setDescription("Ban kata kasar agar guild jadi ramah")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("ban")
      .setDescription("Ban kata kasar nya")
      .addStringOption((option) =>
        option
          .setName("kata")
          .setDescription("Kata apa yang mau di ban?")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("List kata kasar apa yang di ban"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("hapus")
      .setDescription("hapus kata kasar dari server")
      .addStringOption((option) =>
        option
          .setName("kata")
          .setDescription("Kata yang mau di hapus di server")
          .setRequired(true),
      ),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  const subcommand = interaction.options.getSubcommand();
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  switch (subcommand) {
    case "ban": {
      const guildId = interaction.guild.id;
      const kataBan = interaction.options.getString("kata");
      try {
        const cekKata = await banKataModel.findOne({ guildId, word: kataBan });
        if (cekKata) {
          return interaction.editReply({
            embeds: [
              embedBase({
                type: "error",
                title: `Kata ${spoiler(kataBan)} sudah di ban`,
              }),
            ],
          });
        }
        const banKataBaru = new banKataModel({ guildId, word: kataBan });
        banKataBaru.save();
        await interaction.editReply({
          embeds: [
            embedBase({
              type: "info",
              title: `Kata ${spoiler(kataBan)} berhasil di ban`,
            }),
          ],
        });
      } catch (error) {
        console.error("Error cek kata", error);
      }
      break;
    }
    case "list": {
      const guildId = interaction.guild?.id;
      try {
        const bannedWords = await banKataModel.find({ guildId });
        if (bannedWords.length === 0) {
          return await interaction.editReply({
            embeds: [
              embedBase({
                type: "error",
                title: "Belum ada kata yang diban di server ini",
              }),
            ],
          });
        }
        const wordList = bannedWords
          .map((wordObj) => `${spoiler(wordObj.word)}`)
          .join(", ");
        await interaction.editReply({
          embeds: [
            embedBase({
              type: "info",
              title: "List kata yang diban di guild ini!!",
              message: wordList,
            }),
          ],
        });
      } catch (error) {
        console.error("Gagal men-list kata yang di ban", error);
      }
      break;
    }
    case "hapus": {
      const kataApus = interaction.options.getString("kata");
      const guildId = interaction.guild?.id;
      try {
        const deletedWord = await banKataModel.findOne({
          guildId,
          word: kataApus,
        });
        if (!deletedWord) {
          return await interaction.editReply({
            embeds: [
              embedBase({
                type: "error",
                title: `Kata ${spoiler(kataApus)} tidak ada di list ban`,
              }),
            ],
          });
        }
        await banKataModel.deleteOne({ guildId, word: kataApus });
        await interaction.editReply({
          embeds: [
            embedBase({
              type: "info",
              title: `Kata ${spoiler(kataApus)} berhasil di hapus`,
            }),
          ],
        });
      } catch (err) {
        console.error(err);
      }
      break;
    }
    default:
      throw new Error("Pilihan gada bang !");
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  userPermissions: ["Administrator", "ManageRoles"],
};
