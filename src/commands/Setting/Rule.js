import {
    SlashCommandBuilder,
    PermissionFlagsBits,
  } from 'discord.js';
  import Rule from '../../models/rules.js';
  import { fileURLToPath } from 'url';
  
  const __filename = fileURLToPath(import.meta.url);
  
  export const data = new SlashCommandBuilder()
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
    );
  
  export async function run({ interaction }) {
    try {
      const ruleText = interaction.options.getString('text');
      const bannerUrl = interaction.options.getString('banner');
  
      // Periksa apakah pengguna memiliki izin Administrator
      const hasAdminRole = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
  
      if (!hasAdminRole) {
        return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
      }
  
      const rule = new Rule({ rule: ruleText, banner: bannerUrl });
      await rule.save();
      await interaction.reply('Aturan baru telah ditambahkan!' + (bannerUrl ? ' Dengan banner.' : ''));
    } catch (error) {
      console.log(`Error in ${__filename}\n`, error);
      await interaction.reply({ content: 'Terjadi kesalahan saat menambahkan aturan. Silakan coba lagi nanti.', ephemeral: true });
    }
  }
  