import { ApplicationCommandOptionType, ApplicationCommandType, spoiler } from "discord.js";
import banKataModel from "../../models/bankataModel.js";
import embedBase from "../../utils/embeds.js";
import { logger } from '../../logger.js'

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "bankata",
  description: "Ban Kata kasar agar guild jadi ramah",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "ban",
      description: "Ban Kata kasar",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "kata",
          description: "Gunakan koma untuk banyak kata yang diban!",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "list",
      description: "List kata kasar apa yang diban!",
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: "hapus",
      description: "Hapus Kata kasar",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "kata",
          description: "Kata yang ingin di hapus?",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ]
}

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "ban": {
      const guildId = interaction.guild.id;
      const kataBan = interaction.options.getString("kata");
      try {
        let data = await banKataModel.findOne({ guildId });
        const katakasar = kataBan.split(',').map(word => word.trim().toLowerCase())
        if (data) {
          data.words = [...new Set([...data.words, ...katakasar])]
        } else {
          data = new banKataModel({ guildId, words: katakasar })
        }
        try {
          await data.save()
          await interaction.editReply({
            embeds: [embedBase({
              type: "info",
              title: `Kata kasar ${katakasar.map(word => `${spoiler(word)}`).join(' - ')} Berhasil Disimpan ke database!`
            })]
          })
          return;
        } catch (err) {
          logger.error(err, "Terjadi kesalahan dalam save data ke database!")
        }
      } catch (error) {
        logger.error(error, "Error cek kata");
      }
      break;
    }
    case "list": {
      const guildId = interaction.guild?.id;
      try {
        const bannedWords = await banKataModel.findOne({ guildId });
        if (!bannedWords) {
          await interaction.editReply({
            embeds: [embedBase({
              type: "info",
              title: "Tidak ada kata kasar yang diban di guild ini!"
            })]
          })
          return;
        }
        const wordsList = bannedWords.words.map(word => `${spoiler(word)}`).join(' - ')
        await interaction.editReply({
          embeds: [embedBase({
            type: "info",
            title: "Ini adalah kata kasar yang di ban di guild ini!",
            message: `${wordsList}`
          })]
        })
      } catch (error) {
        console.error("Gagal men-list kata yang di ban", error);
      }
      break;
    }
    case "hapus": {
      const wordDanger = interaction.options.getString("kata");
      const guildId = interaction.guild?.id;
      try {
        const wordDelete = wordDanger.split(',').map(word => word.trim().toLowerCase())
        const guildWord = await banKataModel.findOne({ guildId })
        if (!guildWord) {
          await interaction.editReply({
            embeds: [embedBase({
              type: "error",
              message: "Guild ini belom memiliki kata kasar yang diban"
            })]
          })
          return;
        }
        guildWord.words = guildWord.words.filter(word => !wordDelete.includes(word))
        try {
          await guildWord.save();
          await interaction.editReply({
            embeds: [embedBase({
              type: "info",
              title: `Kata Kasar ${katakasar.map(word => `${spoiler(word)}`).join(' - ')} Berhasil di hapus dalam guild!`
            })]
          })
          return;
        } catch (err) {
          await interaction.editReply({
            embeds: [embedBase({
              type: "error",
              message: "Gagal dalam menghapus kata kasar!"
            })]
          })
          logger.error(err, "Tidak Berhasil dalam menghapus katabkasar")
        }
      } catch (error) {
        logger.error(error, "Terjadi kesalahan dalam men akses database")
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
