const {
  MessageFlags,
  Events,
  EmbedBuilder,
  Collection,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async run(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Perintah ${interaction.commandName} tidak di teemukan!`);
      return;
    }

    // cooldown
    const { cooldowns } = interaction.client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expireTimestamps =
        timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expireTimestamps) {
        const timeLeft = (expireTimestamps - now) / 1000;
        const embeds = new EmbedBuilder()
          .setColor("#cc2b52")
          .setDescription(
            `Harap Tunggu **${timeLeft.toFixed(1)}** detik lagi sampai perintah bisa di pakai lagi!`,
          );
        return await interaction.reply({
          embeds: [embeds],
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.run(interaction, interaction.client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
