const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  run: async (client, interaction) => {
    interaction.reply("PONG");
  },
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
};
