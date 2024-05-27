const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  type: { type: String, required: true },
  score: { type: Number, required: true },
  playerAmount: { type: Number, required: true },
});

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  genre: { type: String, required: true },
  rules: [ruleSchema],
  platform: { type: String, required: true },
});

module.exports = mongoose.model("Game", gameSchema);
