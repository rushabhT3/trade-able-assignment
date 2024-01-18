const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

// Route for registering a user
router.post("/register", usersController.registerUser);

// Route for logging a user
router.post("/login", usersController.signinUser);

// Route for fetching user data
router.get("/balance", usersController.getUserData);

module.exports = router;
