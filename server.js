// Required Codes
const express = require("express");
const server = express();

// POST
server.use(express.urlencoded({ extended: true }));

// STATIC FILES
const path = require("path");
server.use("/", express.static(path.join(__dirname, "public")));

// VIEW ENGINE
server.set("view engine", "ejs");

// START Code
server.get("/", (req, res) => {
    res.redirect("/index.html");
})

// Login
server.post("/login-process", (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;

  res.send("Login!");
})

// Sign up
server.post("/signup-process", (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const cfmPassword = data.cfmPassword;

  if (password === cfmPassword) {
    res.send("Signed up!");
  }
  else {
    res.send("Password do not match!");
  }
})

// END Code

// Define the hostname and port for the server
const hostname = "127.0.0.1";
const port = 8000;

// Start server and listen for incoming requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});