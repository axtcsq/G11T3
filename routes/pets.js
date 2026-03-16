const express = require('express');

const petsController = require('./../controllers/petsController');

const router = express.Router(); // sub application

// Define a GET route to display the list of pets
router.get("/pet-list", petsController.showPets);

// Define GET/POST route to add pets to database
router.get("/add-pet", petsController.showAddForm);
router.post("/add-pet", petsController.createPet);

router.get("/del-pet", petsController.showDelForm);
router.post("/del-pet", petsController.deletePet);




// EXPORT
module.exports = router;