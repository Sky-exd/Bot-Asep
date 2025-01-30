import mongoose from "mongoose";

const rulesSchema = new mongoose.Schema({
  rule: String,
});

const rulesModel = mongoose.model("rule", rulesSchema);

export default rulesModel;

