const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wins: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
