const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const authenticateToken = require("./authMiddleware");

// Create a new game
router.post("/", authenticateToken, async (req, res) => {
  const game = new Game(req.body);
  console.log(req.body);
  try {
    await game.save();
    res.status(201).send(game);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find();
    res.send(games);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a game by id
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send();
    }
    res.send(game);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a game by id
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!game) {
      return res.status(404).send();
    }
    res.send(game);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a game by id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).send();
    }
    res.send(game);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
