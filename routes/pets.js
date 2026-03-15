const express = require('express');

const petsController = require('./../controllers/petsController');

const router = express.Router(); // sub application

// Define a GET route to display the list of pets
router.get("/pet-list", petsController.showPets);

// EXPORT
module.exports = router;