const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async run(interaction, client) {
    await interaction.reply("Terima kasih telah menghubungi aku😎");
  },
};
