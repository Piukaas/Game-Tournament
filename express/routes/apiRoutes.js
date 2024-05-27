const express = require("express");
const router = express.Router();

const gameRoutes = require("./gameRoutes");
const tournamentRoutes = require("./tournamentRoutes");
const userRoutes = require("./userRoutes");

router.use("/games", gameRoutes);
router.use("/tournaments", tournamentRoutes);
router.use("/users", userRoutes);

module.exports = router;
