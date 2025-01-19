import {
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import Rule from '../../models/rules.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const data = [
  new SlashCommandBuilder()
    .setName('addrule')
    .setDescription('Tambahkan aturan baru')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Isi aturan yang ingin ditambahkan')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('banner')
        .setDescription('URL gambar banner untuk aturan'),
    ),
  new SlashCommandBuilder()
    .setName('removerule')
    .setDescription('Hapus aturan yang ada')
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setDescription('Nomor aturan yang ingin dihapus')
        .setRequired(true),
    ),
];

export async function run({ interaction }) {
  try {
    const commandName = interaction.commandName;

    if (commandName === 'addrule') {
      const ruleText = interaction.options.getString('text');
      const bannerUrl = interaction.options.getString('banner');

      const hasAdminRole = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

      if (!hasAdminRole) {
        return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
      }

      const rule = new Rule({ rule: ruleText, banner: bannerUrl });
      await rule.save();
      await interaction.reply('Aturan baru telah ditambahkan!' + (bannerUrl ? ' Dengan banner.' : ''));
    } else if (commandName === 'removerule') {
      const ruleNumber = interaction.options.getInteger('number');

      const hasAdminRole = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

      if (!hasAdminRole) {
        return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
      }

      const rules = await Rule.find();
      if (ruleNumber < 1 || ruleNumber > rules.length) {
        return interaction.reply({ content: 'Nomor aturan tidak valid.', ephemeral: true });
      }

      const ruleToRemove = rules[ruleNumber - 1];
      await Rule.deleteOne({ _id: ruleToRemove._id });
      await interaction.reply(`Aturan nomor ${ruleNumber} telah dihapus!`);
    }
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
    await interaction.reply({ content: 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.', ephemeral: true });
  }
}
