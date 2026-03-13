// Required Codes
const express = require("express");
const server = express();
server.use(express.urlencoded({ extended: true }));

const path = require("path");
server.use("/", express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");

// Handles GET request: Redirect the GET request to a static file
server.get("/", (req, res) => {
    res.redirect("/index.html");
})

// Specify Routes
const account = require("./routes/account");
server.use(account);

// Launch web server
const hostname = "127.0.0.1";
const port = 8000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});