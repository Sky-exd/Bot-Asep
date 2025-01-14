import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import WelcomeChannelSchema from "../../models/WelcomeChannel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const data = new SlashCommandBuilder()
  .setName("setup-welcome-channel")
  .setDescription("Set up a welcome channel for your server.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption((option) =>
    option
      .setName("target-channel")
      .setDescription("Select the channel you want to set as welcome channel.")
      .addChannelTypes(ChannelType.GuildAnnouncement)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("custom-message")
      .setDescription("Set a custom welcome message."),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export async function run({ interaction }) {
  try {
    await interaction.deferReply({ ephemeral: true });

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
      });

      return;
    }

    const newWelcomeChannel = new WelcomeChannelSchema({
      ...query,
      customMessage,
    });

    newWelcomeChannel
      .save()
      .then(() => {
        interaction.followUp(`Set ${targetChannel} as welcome channel.`);
      })
      .catch((error) => {
        interaction.followUp("Database error. Please try again later.");
        console.log(`DB error in ${__filename}\n`, error);
      });
  } catch (error) {
    console.log(`Error in ${__filename}\n`, error);
  }
}
