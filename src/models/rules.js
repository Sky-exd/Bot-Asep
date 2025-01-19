import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
    rule: String
});

const rule = mongoose.model("rule", ruleSchema);

export default rule