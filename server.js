// Required Codes
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require("path");
const server = express();
server.use("/", express.static(path.join(__dirname, "public")));

// Specify the path to the environment variable file 'config.env'
dotenv.config({ path: './config.env' });

// Sessions
const secret = process.env.SECRET;
server.use(session({
    secret: secret, // sign the session ID cookie. should be a long, random, and secure string, preferably stored in an environment variable
    resave: false, // Prevents the session from being saved back to the session store if nothing has changed.
    saveUninitialized: false // Prevents a new, empty session from being saved to the store.
}));

// Make sessions available to ALL views
server.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Middleware setup
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }));

// Routes
// Handles GET request: Redirect the GET request to a static file
server.get("/", (req, res) => {
    res.redirect("/index.html");
})

// Specify Routes
const account = require("./routes/account");
server.use(account);

const pet = require("./routes/pets");
server.use(pet);

const application = require("./routes/application");
server.use(application);

const favourites = require("./routes/favourites");
server.use(favourites)

const appointment = require("./routes/appointment");
server.use(appointment)

const reviews = require("./routes/reviews");
server.use(reviews)

// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // Define server hostname
  const port = 8000;// Define port number

  // Start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);