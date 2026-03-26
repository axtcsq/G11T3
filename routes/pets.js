const express = require('express');
const { requireAdmin } = require("../middleware/auth");

const petsController = require('./../controllers/petsController');

const router = express.Router(); // sub application

// Define a GET route to DISPLAY/READ the list of pets
router.get("/display-pet", petsController.showPets);

// Define GET/POST route to ADD pets to database
router.get("/add-pet", requireAdmin, petsController.showAddForm);
router.post("/add-pet", requireAdmin, petsController.createPet);

// Ex 3: Define GET/POST route to edit pets in database
router.get("/edit-pet", petsController.showPetList);
router.get("/update-pet", requireAdmin, petsController.getPet);
router.post("/update-pet", requireAdmin, petsController.updatePet);

// Define GET/POST route to DELETE pets to database
router.get("/del-pet", requireAdmin, petsController.showDelForm);
router.post("/del-pet", requireAdmin, petsController.deletePet);

// EXPORT
module.exports = router;