import {
  MessageFlags,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "setup-welcome-channel",
  description: "Set up Welcome Channel untuk seever ini",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "target-channel",
      description: "Pilih channel buat di set up jadi Welcome Channel",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "custom-message",
      description: "Pesan Custom untuk Welcome Channel",
      type: ApplicationCommandOptionType.String,
    },
  ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction }) {
  try {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const targetChannel = interaction.options.getChannel("target-channel");
    const customMessage = interaction.options.getString("custom-message");

    const query = {
      guildId: interaction.guildId,
      channelId: targetChannel.id,
    };

    const channelExistsInDb = await WelcomeChannelSchema.exists(query);

    if (channelExistsInDb) {
      await interaction.editReply({
        content: "Channel yang anda masukan sudah ada di database.",
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const newWelcomeChannel = new WelcomeChannelSchema({
      ...query,
      customMessage,
    });

    try {
      await newWelcomeChannel.save();
      await interaction.followUp({
        content: `Set ${targetChannel} as welcome channel.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      await interaction.followUp({
        content: "Database error. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
      console.log(`DB error in ${__filename}\n`, error);
    }
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
}

/** @type {import('commandkit').CommandOptions} */
export const options = {
  userPermissions: ["Administrator", "ManageRoles"],
};
