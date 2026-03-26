const express = require('express');
const router = express.Router();

// Functions are from accountController (showLogin, handleLogin, showRegister, handleRegister)
const accountController = require("../controllers/accountController");
const { requireAdmin } = require("../middleware/auth");

// Handles signup routes
router.get("/signup", accountController.showSignup);
router.post("/signup", accountController.handleSignup);

// Handles login routes
router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

// Define a GET route to DISPLAY/READ the list of users
router.get("/display-user", requireAdmin, accountController.showUsers);

// Define GET/POST route to ADD users to database
router.get("/add-user", requireAdmin, accountController.showAddUserForm);
router.post("/add-user", requireAdmin, accountController.createUser);

// Define GET/POST route to edit users in database
router.get("/edit-user", requireAdmin, accountController.showUserList);
router.get("/update-user", requireAdmin, accountController.getUser);
router.post("/update-user", requireAdmin, accountController.updateUser);

// Define GET/POST route to DELETE users to database
router.get("/del-user", requireAdmin, accountController.showDelUserForm);
router.post("/del-user", requireAdmin, accountController.deleteUser);

// Define GET route to logout & destroy sessions
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;