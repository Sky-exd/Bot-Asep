import WelcomeChannelSchema from '../../models/WelcomeChanel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async (guildMember) => {
    try {
        if (guildMember.user.bot) return;

        const welcomeConfigs = await WelcomeChannelSchema.find({
            guildId: guildMember.guild.id,
        });
        if (!welcomeConfigs) return;

        for (const welcomeConfig of welcomeConfigs) {
            const targetChannel = 
                guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
                (await guildMember.guild.channels.fetch(
                welcomeConfig.channelId
                ));
            if (!targetChannel) {
                WelcomeChannelSchema.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: welcomeConfig.channelId,
                }) .catch(() => {});
            }

            const customMessage = welcomeConfig.customMessage || 
                'Hello {mention-member}, welcome to {server-name}!';

            const welcomeMessage = customMessage
                .replace('{mention-member}', `<@${guildMember.id}>`)
                .replace('{username}', guildMember.user.username)
                .replace('{server-name}', guildMember.guild.name)
            
            targetChannel.send(welcomeMessage).catch(() => {});

    }
    } catch (error) {
        console.log(`Error in ${__filename}\n`, error);
    }

};
