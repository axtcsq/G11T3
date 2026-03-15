// Load Model functions
const Account = require("../models/accountModel")

// Handle Login GET request
exports.showLogin = (req, res) => {
    res.render("login", { userName: undefined, errors: [] });
};

// Handle Login POST request
exports.handleLogin = async (req, res) => {
    let userName = (req.body.userName ?? "").trim();
    let password = req.body.password;
    let errors = [];
    
    // Invalid Username
    if (!userName) {
        errors.push("Username is required");
    }

    // Invalid Password
    if (!password) {
        errors.push("Password is required");
    }

    // No Errors
    if (errors.length === 0) {
        
        // Authenticate
        const isLoggedIn = await Account.authenticateUser(userName, password);
        
        // If authenticate response is invalid
        if (!isLoggedIn) {
            errors.push("Invalid username or password.");
        }

        if (isLoggedIn) {
            return res.redirect("/pet-list");
        }
    }

    res.render("login", { userName, errors });
};

// Handle Signup GET request
exports.showSignup = (req, res) => {
    res.render("signup", { userName: undefined, fullName: undefined, errors: [] })
};

// Handle Signup POST request
exports.handleSignup = async (req, res) => {
    
    // Retrieves data from form
    let data = req.body;
  
    let userName = (data.userName ?? "").trim();
    let fullName = (data.fullName ?? "").trim();
    let password = data.password;
    let password2 = data.password2;
    let errors = [];

    // Empty username
    if (!userName) {
        errors.push("Username is required");
    }

    // Empty fullname
    if (!fullName) {
        errors.push("Full Name is required");
    }

    // Empty password
    if (!password) {
        errors.push("Password is required");
    }

    // Unmatched password
    if (password !== password2) {
        errors.push("Passwords don't match");
    }

    // No errors
    if (errors.length === 0) {
        
        // Attempt sign up process
        try {
            await Account.registerUser(userName, fullName, password);
        } catch (err) {
            errors.push(err.message);
        }
    }

    res.render("signup", { userName, fullName, errors });
};