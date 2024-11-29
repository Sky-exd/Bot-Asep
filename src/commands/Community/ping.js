const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async run( interaction) {
    await interaction.reply("Terima kasih telah menghubungi aku😎");
  },
};
