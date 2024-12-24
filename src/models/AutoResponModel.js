import { Schema, model } from "mongoose";
const autoresponSchema = new Schema({
  guildId: String,
  autorespon: [
    {
      pesan: String,
      balesan: String
    },
  ]
})

const autoresponModel = model("autorespon", autoresponSchema);
export default autoresponModel;
