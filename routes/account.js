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

// Define a GET route to DISPLAY/READ the list of users
router.get("/display-user", accountController.showUsers);

// Define GET/POST route to ADD users to database
router.get("/add-user", accountController.showAddUserForm);
router.post("/add-user", accountController.createUser);

// Define GET/POST route to edit users in database
router.get("/edit-user", accountController.showUserList);
router.get("/update-user", accountController.getUser);
router.post("/update-user", accountController.updateUser);

// Define GET/POST route to DELETE users to database
router.get("/del-user", accountController.showDelUserForm);
router.post("/del-user", accountController.deleteUser);

module.exports = router;