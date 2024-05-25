const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware");

// Register a new user
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get all usernames and wins
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username wins");
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// Activate a user
router.patch("/:id/activate", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isActive: true,
    });
    if (!user) {
      return res.status(404).send("Cannot find user");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  if (!user.isActive) {
    return res.status(403).send("User is not active");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ user: user, token: token });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
