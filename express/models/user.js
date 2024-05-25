const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  wins: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
