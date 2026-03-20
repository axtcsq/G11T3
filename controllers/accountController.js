// Load Account Model functions
const Account = require("../models/accountModel")

// Sign Ups
// Handle Signup GET request: Displays form on initial load
exports.showSignup = (req, res) => {
    res.render("signup", { userName: undefined, fullName: undefined, password: undefined, password2: undefined, gender: undefined, type: undefined, errors: [] });
};

// Handle Signup POST request: Takes care of form submission
exports.handleSignup = async (req, res) => {
    
    // Retrieves data from form
    let data = req.body;
  
    let userName = data.userName;
    let fullName = data.fullName;
    let password = data.password;
    let password2 = data.password2;
    let gender = data.gender;
    let type = data.type;

    // Initialise error list
    let errors = [];

    // Create a structure that stores the new user
    let newUser = {
        userName: userName,
        fullName: fullName,
        password: password,
        gender: gender,
        type: type
    };

    // Validation: Handles invalid fields
    if (!userName || !fullName || !password || !password2 || !gender || !type) {
        errors.push("All fields are required");
    }
    
    // Unmatched password
    if (password !== password2) {
        errors.push("Passwords don't match");
    };

    // If there's errors
    if (errors.length > 0) {
        return res.render("signup", { userName, fullName, gender, type, errors });
    }

    // No errors
    // Attempt sign up process
    try {
        let result = await Account.addUser(newUser);
        console.log("User added successfully");
    
        res.redirect("/login");
    } catch (err) {
        console.error(err);
    
        // Added as result will not be returned when operation is not successful
        let result = "fail";
        errors.push("An error occured while adding to the database");

        res.render("signup", { result, userName, fullName, gender, type, errors });
    }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------

// Login
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

        let isAdmin = false;
        
        if (userName == "admin" && password == "admin"){
            isAdmin = true
        }
        const isLoggedIn = await Account.authenticateUser(userName, password);
        
        // If authenticate response is invalid
        if (!isLoggedIn) {
            errors.push("Invalid username or password.");
        }

        if (isLoggedIn) {
            //check if its admin
            let isAdmin = false;
            if (userName == "admin" && password == "admin"){
            isAdmin = true}
            const petList = await Pet.retrieveAll()
            console.log(isAdmin)
            // if logged in then render the display pet with isAdmin
            return res.render("display-pet", {petList, isAdmin, userName});
        }
    }

    res.render("login", { userName, errors});
};