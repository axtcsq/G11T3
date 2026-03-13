const express = require('express');
const router = express.Router();

// Functions are from accountController (showLogin, handleLogin, showRegister, handleRegister)
const accountController = require("../controllers/accountController");

router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

router.get("/signup", accountController.showSignup);
router.post("/signup", accountController.handleSignup);

module.exports = router;