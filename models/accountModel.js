// Model handles all the data related operations
const fs = require("node:fs/promises");
const path = require("path");
const USERS_FILE = path.join(__dirname, "../data/users.json");

// Reading users
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(data);
    
    // Error handling
    } catch (err) {
        // file doesn't exist yet
        return {};
    }
}

// Writing users
async function writeUsers(users) {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );
}

// Register a User (signup)
async function registerUser(userName, fullName, password) {
    const users = await readUsers();
    
    // If there's an existing username
    if (users[userName]) {
        throw new Error("Username already exists");
    }

    // Otherwise, insert new data entry
    users[userName] = {
        fullName,
        password
    };

    await writeUsers(users);
}

// Authenticate a User
async function authenticateUser(userName, password) {
    // Read current user
    const users = await readUsers();
    const user = users[userName];

    // User does not exist
    if (!user) return false;

    // User exists & returns if inputted & registered password matches
    return user.password === password;
}

// Exports functions for usage in accountController
module.exports = {
    registerUser,
    authenticateUser
};