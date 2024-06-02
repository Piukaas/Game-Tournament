const express = require("express");
const router = express.Router();
const Tournament = require("../models/tournament");
const authenticateToken = require("./authMiddleware");

// Create a new tournament
router.post("/", authenticateToken, async (req, res) => {
  const tournament = new Tournament(req.body);
  try {
    await tournament.save();
    res.status(201).send(tournament);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tournaments
router.get("/", async (req, res) => {
  const title = req.query.title || "";
  const status = req.query.status;
  try {
    let query = {
      title: { $regex: new RegExp(title, "i") },
    };

    if (status) {
      query.status = status;
    }

    const tournaments = await Tournament.aggregate([
      { $match: query },
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "Actief"] }, then: 1 },
                { case: { $eq: ["$status", "Aankomend"] }, then: 2 },
                { case: { $eq: ["$status", "Afgerond"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { statusOrder: 1, date: -1 } },
      { $unset: "statusOrder" },
    ]);

    const populatedTournaments = await Tournament.populate(tournaments, {
      path: "totalWinner",
    });

    res.send(populatedTournaments);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a tournament by id
router.get("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("users")
      .populate("games.game")
      .populate("games.winner")
      .populate("totalWinner");

    if (!tournament) {
      return res.status(404).send();
    }
    res.send(tournament);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a tournament by id
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).send();
    }

    if (tournament.status === "Afgerond") {
      return res.status(400).send({
        error:
          "Only tournaments with status 'Aankomend' or 'Actief' can be edited.",
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.send(updatedTournament);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a tournament by id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).send();
    }
    res.send(tournament);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;