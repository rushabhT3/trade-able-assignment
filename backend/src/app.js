const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const usersRoutes = require("./routes/users");
const referralLinksRoutes = require("./routes/referralLinks");

// Mount the routes
app.use("/api/referral", referralLinksRoutes);
app.use("/api", usersRoutes);

// Correct connection string syntax
const uri = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

module.exports = app;
