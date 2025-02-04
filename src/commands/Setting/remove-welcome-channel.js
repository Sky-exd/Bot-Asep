import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  MessageFlags,
} from "discord.js";
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { logger } from "../../logger.js";
import EmbedBase from "../../utils/embeds.js";

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

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, client }) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const targetChannel = interaction.options.getChannel("target-channel");

  const query = {
    guildId: interaction.guild.id,
    channelId: targetChannel.id,
  };

  const channelExistsInDb = await WelcomeChannelSchema.exists(query);

  if (!channelExistsInDb) {
    await interaction.followUp({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          title: "Tidak ada channel yang di setting jadi Welcome Channel",
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    await WelcomeChannelSchema.findOneAndDelete(query);
    await interaction.followUp({
      embeds: [
        new EmbedBase({
          client,
          title: `Berhasil Hapus ${targetChannel} sebagai welcome channel.`,
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
    return;
  } catch (error) {
    logger.error(error, "Database ada yang error bang!");
    await interaction.followUp({
      embeds: [
        new EmbedBase({
          client,
          type: "error",
          title: "Ada Kesalahan dalam Database, Tolong coba lagi nanti!",
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
};
