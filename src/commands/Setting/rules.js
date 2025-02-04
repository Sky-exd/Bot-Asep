import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import Rule from "../../models/rulesModel.js";
import { fileURLToPath } from "url";
import EmbedBase from "../../utils/embeds.js";

const __filename = fileURLToPath(import.meta.url);

export const data = new SlashCommandBuilder()
  .setName("rules")
  .setDescription("Manage rules")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Tambahkan aturan baru")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Isi aturan yang ingin ditambahkan")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("banner")
          .setDescription("URL gambar banner untuk aturan"),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Hapus aturan yang ada")
      .addIntegerOption((option) =>
        option
          .setName("number")
          .setDescription("Nomor aturan yang ingin dihapus")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("Menampilkan daftar aturan di channel yang ditargetkan")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            "Channel yang ingin ditargetkan untuk menampilkan aturan",
          )
          .setRequired(true),
      ),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, client }) => {
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "add": {
      const ruleText = interaction.options.getString("text");
      const bannerUrl = interaction.options.getString("banner");

      try {
        const rule = new Rule({ rule: ruleText, banner: bannerUrl });
        await rule.save();
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              title:
                "Aturan baru telah ditambahkan!" +
                (bannerUrl ? " Dengan banner." : ""),
            }),
          ],
        });
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              type: "error",
              title:
                "Terjadi kesalahan saat menambahkan aturan. Silakan coba lagi nanti.",
            }),
          ],
        });
      }
      break;
    }
    case "remove": {
      const ruleNumber = interaction.options.getInteger("number");

      try {
        const rules = await Rule.find();
        if (ruleNumber < 1 || ruleNumber > rules.length) {
          return interaction.editReply({
            embeds: [
              new EmbedBase({
                client,
                type: "error",
                title: "Nomor aturan tidak valid.",
              }),
            ],
          });
        }

        const ruleToRemove = rules[ruleNumber - 1];
        await Rule.deleteOne({ _id: ruleToRemove._id });
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              title: `Aturan nomor ${ruleNumber} telah dihapus!`,
            }),
          ],
        });
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              type: "error",
              title:
                "Terjadi kesalahan saat menghapus aturan. Silakan coba lagi nanti.",
            }),
          ],
        });
      }
      break;
    }
    case "list": {
      const targetChannel = interaction.options.getChannel("channel");

      try {
        const rules = await Rule.find({});
        if (!rules.length) {
          await interaction.editReply({
            embeds: [
              new EmbedBase({
                client,
                title: "Tidak ada peraturan yang ditemukan.",
              }),
            ],
          });
          return;
        }

        const embed = new EmbedBase({
          client,
          title: "Daftar Peraturan",
        });

        rules.forEach((rule, index) => {
          embed.addFields([
            { name: `Peraturan ${index + 1}`, value: rule.rule },
          ]);
        });

        await targetChannel.send({ embeds: [embed] });
        await interaction.editReply({
          content: `Daftar peraturan telah dikirim ke ${targetChannel}`,
        });
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          embeds: [
            new EmbedBase({
              client,
              type: "error",
              title:
                "Terjadi kesalahan saat mengambil daftar peraturan. Silakan coba lagi nanti.",
            }),
          ],
        });
      }
      break;
    }
    default:
      throw new Error("Pilihan tidak valid!");
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  userPermissions: ["Administrator", "ManageRoles"],
};
