const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  rule: String,
  type: String,
  score: Number,
  playerAmount: Number,
});

const gameSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  genre: String,
  rules: [ruleSchema],
  platform: String,
});

module.exports = mongoose.model("Game", gameSchema);
