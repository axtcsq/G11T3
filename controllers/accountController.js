// Load Account Model functions
const Account = require("../models/accountModel")
const Pet = require('./../models/petsModel');


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
    res.render("login", { userName: undefined, password: undefined, errors: [], isAdmin: null });
};

// Handle Login POST request
exports.handleLogin = async (req, res) => {
    
    // Retrieves form data
    const data = req.body;
    let userName = data.userName;
    let password = data.password;

    // Initialise error list
    let errors = [];
    let isAdmin = false;
    
    // Invalid Username
    if (!userName) {
        errors.push("Username is required");
    };

    // Invalid Password
    if (!password) {
        errors.push("Password is required");
    };

    // Displays error
    if (errors.length > 0) {
        return res.render("login", { userName, errors, isAdmin });
    }

    // No Errors
    if (errors.length === 0) {
        
        // Check if its an existing user
        const user = await Account.findByID(userName);
        
        // Checks users existence & credentials
        if (!user || user.password !== password) {
            errors.push("Invalid username or password.");

            return res.render("login", { userName, errors, isAdmin });
        }

        // Checks user type status
        if (user.type === "admin") {
            isAdmin = true;
        }
    }

    // Required to pass to the next page
    let petList = await Pet.retrieveAll();// fetch all the list    
    console.log(petList);

    res.render("display-pet", { petList, isAdmin, userName }); // Render the EJS form view and pass the posts

};

// -------------------------------------------------------------------------------------------------------------------------------------------------

// User Management (CRUD)
// READ - Show all users
exports.showUsers = async (req, res) => {
    // Retrieves user
    try {
        let userList = await Account.retrieveAll();
        res.render("display-user", { userList });
    // Error Occurs
    } catch (err) {
        console.error(err);
        res.send("Error retrieving users");
    }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------

// ADD - Show form
exports.showAddUserForm = (req, res) => {
    res.render("add-user", { result: "", msg: "", userName: "", fullName: "" });
};

// ADD - Create user
exports.createUser = async (req, res) => {
    
    // Retrieves form data
    const data = req.body;

    const userName = data.userName;
    const fullName = data.fullName;
    const password = data.password;
    const gender = data.gender;
    const type = data.type;

    // Create a structure that stores the new user
    let newUser = {
        userName: userName,
        fullName: fullName,
        password: password,
        gender: gender,
        type: type
    };

    // Handles validation
    if (!userName || !fullName || !password || !gender || !type) {
        let result = null;
        let msg = "All fields are required";

        return res.render("add-user", { 
            result: "fail", 
            msg, 
            userName, 
            fullName 
        });
    }

    // When successful
    try {
        let result = await Account.addUser(newUser);
        let msg = "User added successfully";
        
        res.render("add-user", { result, msg, userName: "", fullName: "" 
        });
    // When fail
    } catch (error) {
        console.error(error);
        
        // Added as result will not be returned when operation is not successful
        let result = "fail";
        let msg = "An error occured when adding a new user";

        res.render("add-user", { 
            result, msg, userName, fullName 
        });
    }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------

// UPDATE - Show user list
exports.showUserList = async (req, res) => {
    try {
        let userList = await Account.retrieveAll();
        res.render("edit-user", { userList });
    } catch (err) {
        console.error(err);
        res.send("Error retrieving users");
    }
};

// UPDATE - Get single user
exports.getUser = async (req, res) => {
    const userName = req.query.userName;

    try {
        // find() always return an Array of result
        // findOne will return 1 document
        // let result = await Account.findByID(userName); // find a user with its userName
        let user = await Account.findByID(userName);
        res.render("update-user", { result: user || null, successful: false });

    } catch (err) {
        console.error(err);
    }
};

// UPDATE - Update user
exports.updateUser = async (req, res) => {
    const data = req.body;

    const userName = data.userName;
    const newFullName = data.fullName;
    const newPassword = data.password;
    const newGender = data.gender;
    const newType = data.type;

    // When successful
    try {
        await Account.editUser(userName, newFullName, newPassword, newGender, newType);
        let updatedUser = await Account.findByID(userName);

        res.render("update-user", { successful: true, result: updatedUser });
    // When unsuccessful
    } catch (err) {
        console.error(err);
    }
};

// -------------------------------------------------------------------------------------------------------------------------------------------------

// DELETE - Show delete form
exports.showDelUserForm = async (req, res) => {
    let userList = await Account.retrieveAll();

    res.render("del-user", { userList, result: "", msg: "" });
};

// DELETE - Delete user
exports.deleteUser = async (req, res) => {
    const userName = req.body.userName;

    let userList = await Account.retrieveAll(); // fetch all the list  

    try {
        let result = await Account.deleteUser(userName);

        if (result.deletedCount === 0) {
            return res.render("del-user", { userList, result: "fail", msg: "User not found" });
        }

        res.render("del-user", { userList, result: "success", msg: "User deleted successfully" });
    
    } catch (err) {
        let result = "fail";
        let msg = "Error deleting pet";

        console.error(err);

        res.render("del-user", { userList, result, msg });
    }
};
