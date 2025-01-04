import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const data = new SlashCommandBuilder()
  .setName("remove-welcome-channel")
  .setDescription("Remove the welcome channel from the server.")
  .addChannelOption((option) =>
    option
      .setName("target-channel")
      .setDescription(
        "Select the channel you want to remove as welcome channel.",
      )
      .setRequired(true),
  );

export async function run({ interaction }) {
  try {
    const targetChannel = interaction.options.getChannel("target-channel");

    await interaction.deferReply({ ephemeral: true });

    const query = {
      guildId: interaction.guildId,
      channelId: targetChannel.id,
    };

    const channelExistsInDb = await WelcomeChannelSchema.exists(query);

    if (!channelExistsInDb) {
      await interaction.followUp("This channel is not set as welcome channel.");

      return;
    }

    WelcomeChannelSchema.findOneAndDelete(query)
      .then(() => {
        interaction.followUp(`Removed ${targetChannel} as welcome channel.`);
      })
      .catch((error) => {
        interaction.followUp("Database error. Please try again later.");
        console.log(`DB error in ${__filename}\n`, error);
      });
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
}
