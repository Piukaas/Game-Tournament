const express = require("express");
const router = express.Router();

const gameRoutes = require("./gameRoutes");
const userRoutes = require("./userRoutes");

router.use("/games", gameRoutes);
router.use("/users", userRoutes);

module.exports = router;
