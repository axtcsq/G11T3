const express = require('express');

const petsController = require('./../controllers/petsController');

const router = express.Router(); // sub application

// Define a GET route to DISPLAY/READ the list of pets
router.get("/display-pet", petsController.showPets);
// i deleted the pet list route, as it doesnt redirect to pet list, and instead renders the display pet in login IF the authentication passes
// reply: i think no harm including the get since it applies to both account roles & otherwise the nav bar wont work; anyway i'll add back for now for testing purposes

// Define GET/POST route to ADD pets to database
router.get("/add-pet", petsController.showAddForm);
router.post("/add-pet", petsController.createPet);

// Define GET/POST route to DELETE pets to database
// Ex 3: Define GET/POST route to edit books in database
router.get("/edit-pet", petsController.showPetList);
router.get("/update-pet", petsController.getPet);
router.post("/update-pet", petsController.updatePet);

// Define GET/POST route to DELETE pets to database
router.get("/del-pet", petsController.showDelForm);
router.post("/del-pet", petsController.deletePet);

// EXPORT
module.exports = router;