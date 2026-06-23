const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout } = require("../controllers/authController");

// Redirect /users to shop
router.get("/", function (req, res) {
    res.redirect("/shop");
});

// Register a new user
router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

// Logout user
router.get("/logout", logout);

module.exports = router;
