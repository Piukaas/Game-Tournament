require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const routes = require("./express/routes");

const app = express();

app.use(express.json());

app.use("/games", routes.gameRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
