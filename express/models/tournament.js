const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  rule: { type: String, required: true },
  type: { type: String, required: true },
  score: { type: Number, required: true },
  playerAmount: { type: Number, required: true },
});

const tournamentSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  gamesAmount: { type: Number, required: true },
  filters: {
    genre: [String],
    type: [String],
    platform: [String],
    playerAmount: [Number],
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  games: [
    {
      game: { type: Schema.Types.ObjectId, ref: "Game" },
      rule: ruleSchema,
      winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
  ],
  totalWinner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, default: "Aankomend" },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
