const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  genre: String,
  rules: [String],
  playerAmount: Number,
  platform: String,
  score: Number,
});

module.exports = mongoose.model("Game", gameSchema);
