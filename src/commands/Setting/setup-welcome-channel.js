import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import WelcomeChannelSchema from '../../models/WelcomeChannel.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const data = new SlashCommandBuilder()
    .setName('setup-welcome-channel')
    .setDescription('Set up a welcome channel for your server.')
    .addChannelOption((option) =>
        option
            .setName('target-channel')
            .setDescription('Select the channel you want to set as welcome channel.')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('custom-message')
            .setDescription(
                'Set a custom welcome message.'
            )
    );

export async function run({ interaction }) {
    try {
        const targetChannel = interaction.options.getChannel('target-channel');
        const customMessage = interaction.options.getString('custom-message');

        await interaction.deferReply({ ephemeral: true });

        const query = {
            guildId: interaction.guildId,
            channelId: targetChannel.id,
        };

        const channelExistsInDb = await WelcomeChannelSchema.exists(query);

        if (channelExistsInDb) {
            await interaction.editReply({
                content: 'Channel yang anda masukan sudah ada di database.',
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
                interaction.followUp(
                    `Set ${targetChannel} as welcome channel.`
                );
            })
            .catch((error) => {
                interaction.followUp('Database error. Please try again later.');
                console.log(`DB error in ${__filename}\n`, error);
            });

    } catch (error) {
        console.log(`Error in ${__filename}\n`, error);
    }
}
