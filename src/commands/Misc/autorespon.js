import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import autorespon from "../../models/AutoResponModel.js";
import EmbedBase from "../../utils/embeds.js";

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "autorespon",
  description: "Setting auto balas pesan yang ada di guild!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "tambah",
      description: "Tambah pesan yang akan dibalas otomatis",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "pesan",
          description: "Pesan nya",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "balasan",
          description: "Balesan dari pesan otomatis",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "hapus",
      description: "hapus pesan otomatis",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "pesan",
          description: "Pesan nya",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "hapus-semua",
      description: "Hapus semua pesan otomatis",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "list",
      description: "List semua pesan otomatis",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, client }) => {
  if (!interaction.replied && !interaction.deferred)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  const pesan = interaction.options.getString("pesan");
  const balesan = interaction.options.getString("balesan");
  const guildId = interaction.guild.id;
  switch (subcommand) {
    case "tambah": {
      const data = await autorespon.findOne({ guildId });
      if (!data) {
        await autorespon.create({
          guildId,
          autorespon: [
            {
              pesan: pesan,
              balesan: balesan,
            },
          ],
        });
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
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
                new EmbedBase({
                  client,
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
          { guildId },
          { $push: { autorespon: addto } },
        );
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
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
      const data = await autorespon.findOne({
        guildId,
        "autorespon.pesan": pesan,
      });
      if (!data) {
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              type: "error",
              title: "Pesan otomatis tidak ditemukan!",
              message: `Pesan: ${pesan}\nTolong cek kembali!`,
            }),
          ],
        });
      } else {
        await autorespon.findOneAndUpdate(
          { guildId },
          { $pull: { autorespon: { pesan: pesan } } },
        );
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
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
      await interaction.editReply({
        embeds: [
          new EmbedBase({
            client,
            type: "info",
            title: "Fitur belom dibuat sabar !",
          }),
        ],
      });
      break;
    }
    case "list": {
      const data = await autorespon.findOne({ guildId });
      if (!data || !data.autorespon || data.autorespon.length === 0) {
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
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
            new EmbedBase({
              client,
              type: "info",
              title: "List Pesan Otomatis",
            }).addFields(fields),
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
  userPermissions: ["Administrator", "ManageRoles"],
};
