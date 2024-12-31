import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('simulate-join')
    .setDescription('Simulate a member join event.')
    .addUserOption((option) => 
        option
            .setName('target-user')
            .setDescription('Select the user you want to simulate join.')
            .setRequired(true)
    );

export async function run({ interaction, client }) {
    const targetUser = interaction.options.getUser('target-user');

    let member;

    if (targetUser) {
        member = 
            interaction.guild.members.cache.get(targetUser.id) ||
            (await interaction.guild.members.fetch(targetUser.id));
    } else {
        member = interaction.member;
    }

    client.emit('guildMemberAdd', member);

    interaction.reply(`Simulated join event for ${member}`);
}