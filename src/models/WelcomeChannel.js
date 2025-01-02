import { model, Schema } from 'mongoose';


const WelcomeChannelSchema = new Schema(
    {
        guildId: {
            type: String,
            required: true,
        },
        channelId: {
            type: String,
            required: true,
            unique: true,
        },
        customMessage: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const WelcomeChannelModel = model('Welcome-channel', WelcomeChannelSchema);
export default WelcomeChannelModel
