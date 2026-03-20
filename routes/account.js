const express = require('express');
const router = express.Router();

// Functions are from accountController (showLogin, handleLogin, showRegister, handleRegister)
const accountController = require("../controllers/accountController");

// Handles signup routes
router.get("/signup", accountController.showSignup);
router.post("/signup", accountController.handleSignup);

// Handles login routes
router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

module.exports = router;