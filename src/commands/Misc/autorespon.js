import { SlashCommandBuilder } from "discord.js";
import autorespon from "../../models/AutoResponModel.js";
import embed from "../../utils/embeds.js";

export const data = new SlashCommandBuilder()
  .setName("autorespon")
  .setDescription("Setting auto balas pesan yang ada di guild!")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("tambah")
      .setDescription("Tambahkan pesan yang akan dibalas")
      .addStringOption((option) =>
        option
          .setName("pesan")
          .setDescription("Pesan yang akan dibalas")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("balesan")
          .setDescription("Pesan balasan")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("hapus")
      .setDescription("Hapus pesan yang akan dibalas otomatis")
      .addStringOption((option) =>
        option
          .setName("pesan")
          .setDescription("Pesan yang akan dibalas")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("hapus-semua")
      .setDescription("Hapus semua pesan yang akan dibalas otomatis")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("List pesan apa saja yang dibales otomatis")
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  if (!interaction.replied && !interaction.deferred)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "tambah": {
      const pesan = interaction.options.getString("pesan");
      const balesan = interaction.options.getString("balesan");
      const data = await autorespon.findOne({ guildId: interaction.guild.id });
      if (!data) {
        await autorespon.create({
          guildId: interaction.guild.id,
          autorespon: [
            {
              pesan: pesan,
              balesan: balesan,
            },
          ],
        });
        await interaction.editReply({
          embeds: [
            embed({
              type: "success",
              title: "Pesan otomatis berhasil dibuat!",
              message: `Pesan: ${pesan}\nBalasan: ${balesan}`,
            }),
          ],
        });
      } else {
        const autoresponder = data.autorespon;
        for (const p of autoresponder) {
          if (p.pesan === pesan) {
            return interaction.editReply({
              embeds: [
                embed({
                  type: "error",
                  title: "Pesan otomatis sudah ada!",
                  message: `Pesan: ${pesan}\nTolong lebih spesifik lagi!`,
                }),
              ],
            });
          }
        }

        const addto = {
          pesan: pesan,
          balesan: balesan,
        };
        await autorespon.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { $push: { autorespon: addto } }
        );
        await interaction.editReply({
          embeds: [
            embed({
              type: "success",
              title: "Pesan otomatis berhasil di tambahkan!",
              message: `Pesan: ${pesan}\nBalasan: ${balesan}`,
            }),
          ],
        });
      }
      break;
    }
    case "hapus": {
      const pesan = interaction.options.getString("pesan");
      const data = await autorespon.findOne({
        guildId: interaction.guild.id,
        "autorespon.pesan": pesan,
      });
      if (!data) {
        await interaction.editReply({
          embeds: [
            embed({
              type: "error",
              title: "Pesan otomatis tidak ditemukan!",
              message: `Pesan: ${pesan}\nTolong cek kembali!`,
            }),
          ],
        });
      } else {
        await autorespon.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { $pull: { autorespon: { pesan: pesan } } }
        );
        await interaction.editReply({
          embeds: [
            embed({
              type: "success",
              title: "Pesan otomatis berhasil di hapus!",
              message: `Pesan: ${pesan}`,
            }),
          ],
        });
      }
      break;
    }
    case "hapus-semua": {
      console.log("hapus semua");
      break;
    }
    case "list": {
      const data = await autorespon.findOne({ guildId: interaction.guild.id });
      if (!data || !data.autorespon || data.autorespon.length === 0) {
        await interaction.editReply({
          embeds: [
            embed({
              type: "info",
              title: "Tidak ada pesan otomatis!",
              message: `Tolong tambahkan pesan otomatis dengan menggunakan \`/autorespon tambah\``,
            }),
          ],
        });
      } else {
        const fields = [];
        data.autorespon.forEach((p, i) => {
          fields.push({
            name: `Pesan ${i + 1}`,
            value: `Pesan: ${p.pesan}\nBalasan: ${p.balesan}`,
          });
        });
        await interaction.editReply({
          embeds: [
            embed({
              type: "info",
              title: "List Pesan Otomatis",
              options: {
                fields: fields,
              },
            }),
          ],
        });
      }
      break;
    }
    default: {
      throw new Error("Unknown subcommand");
    }
  }
};

export const options = {
  devOnly: true,
};
