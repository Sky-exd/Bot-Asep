import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
import Rule from "../../models/rules.js";
import { fileURLToPath } from "url";

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
export const run = async ({ interaction }) => {
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
        await interaction.editReply(
          "Aturan baru telah ditambahkan!" +
            (bannerUrl ? " Dengan banner." : ""),
        );
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          content:
            "Terjadi kesalahan saat menambahkan aturan. Silakan coba lagi nanti.",
          ephemeral: true,
        });
      }
      break;
    }
    case "remove": {
      const ruleNumber = interaction.options.getInteger("number");

      const hasAdminRole = interaction.member.permissions.has(
        PermissionFlagsBits.Administrator,
      );

      if (!hasAdminRole) {
        return interaction.editReply({
          content: "Kamu tidak memiliki izin untuk menggunakan perintah ini.",
          ephemeral: true,
        });
      }

      try {
        const rules = await Rule.find();
        if (ruleNumber < 1 || ruleNumber > rules.length) {
          return interaction.editReply({
            content: "Nomor aturan tidak valid.",
            ephemeral: true,
          });
        }

        const ruleToRemove = rules[ruleNumber - 1];
        await Rule.deleteOne({ _id: ruleToRemove._id });
        await interaction.editReply(
          `Aturan nomor ${ruleNumber} telah dihapus!`,
        );
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          content:
            "Terjadi kesalahan saat menghapus aturan. Silakan coba lagi nanti.",
          ephemeral: true,
        });
      }
      break;
    }
    case "list": {
      const targetChannel = interaction.options.getChannel("channel");

      try {
        const rules = await Rule.find({});
        if (!rules.length) {
          return interaction.editReply("Tidak ada peraturan yang ditemukan.");
        }

        const embed = new EmbedBuilder()
          .setTitle("Daftar Peraturan")
          .setColor(0x0099ff);

        rules.forEach((rule, index) => {
          embed.addFields([
            { name: `Peraturan ${index + 1}`, value: rule.rule },
          ]);
        });

        await targetChannel.send({ embeds: [embed] });
        await interaction.editReply(
          `Daftar peraturan telah dikirim ke ${targetChannel}`,
        );
      } catch (error) {
        console.error(`Error in ${__filename}\n`, error);
        await interaction.editReply({
          content:
            "Terjadi kesalahan saat mengambil daftar peraturan. Silakan coba lagi nanti.",
          ephemeral: true,
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
