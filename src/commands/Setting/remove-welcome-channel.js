import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  MessageFlags,
} from "discord.js";
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { logger } from "../../logger.js";

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "remove-welcome-channel",
  description: "Hapus welcome channel dari server",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "target-channel",
      description: "Pilih channel mana yang mau di hapus dari WelcomeChannel",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
};

export async function run({ interaction }) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const targetChannel = interaction.options.getChannel("target-channel");

  const query = {
    guildId: interaction.guildId,
    channelId: targetChannel.id,
  };

  const channelExistsInDb = await WelcomeChannelSchema.exists(query);

  if (!channelExistsInDb) {
    await interaction.followUp({
      content: "This channel is not set as welcome channel.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    await WelcomeChannelSchema.findOneAndDelete(query);
    await interaction.followUp({
      content: `Removed ${targetChannel} as welcome channel.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  } catch (error) {
    logger.error(error, "Database ada yang error bang!");
    await interaction.followUp({
      content: "Database error. Please try again later.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
