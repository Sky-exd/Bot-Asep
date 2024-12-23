import { model, Schema } from "mongoose";

const banKataSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  word: {
    type: String,
    required: true,
    unique: true,
  },

})

const banKataModel = model("bankata", banKataSchema);

export default banKataModel

