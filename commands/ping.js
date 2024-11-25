const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  run: async (client, interaction) => {
    interaction.reply("Terima kasih telah menghubungi aku😎");
  },
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
};
