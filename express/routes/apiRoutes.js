const express = require("express");
const router = express.Router();

const gameRoutes = require("./gameRoutes");

router.use("/games", gameRoutes);

module.exports = router;
