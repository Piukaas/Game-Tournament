require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRoutes = require("./express/routes/apiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
