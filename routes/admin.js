const express = require("express");

const router = express.Router();
const petsController = require("../controllers/pets-controller");

// Defines a route that handles GET requests to /admin by delegating 
// the request to the showForm function in the blogsController.
router.get("/admin", petsController.showForm);

module.exports = router;