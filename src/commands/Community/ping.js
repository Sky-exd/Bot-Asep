const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("ping").setDescription("Nyapa bot !"),
  async run(interaction) {
    await interaction.reply("Terima kasih telah menghubungi aku😎");
  },
};
