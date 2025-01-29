import { model, Schema } from "mongoose";

const banKataSchema = new Schema({
  guildId: {
    type: String,
    unique: true,
    required: true,
  },
  words: {
    type: [String],
    default: []
  }
})

const banKataModel = model("bankata", banKataSchema);

export default banKataModel

