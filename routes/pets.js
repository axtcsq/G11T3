const express = require('express');
const { requireLogin, requireAdmin } = require("../middleware/auth");

const petsController = require('./../controllers/petsController');

const router = express.Router(); // sub application
const multer = require("multer"); // require file uploading functions
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Define a GET route to DISPLAY/READ the list of pets
router.get("/display-pet", requireLogin, petsController.showPets);
router.get('/display-pets/:_id', petsController.displayPetDetails);

// Define GET route to ADD pets to database & // Define a POST route to upload photos 
router.get("/add-pet", requireAdmin, petsController.showAddForm);
router.post("/add-pet", requireAdmin, upload.single("photo"), petsController.createPet);

// Ex 3: Define GET/POST route to edit pets in database
router.get("/edit-pet", petsController.showPetList);
router.get("/update-pet", requireAdmin, petsController.getPet);
router.post("/update-pet", requireAdmin, upload.single("photo"), petsController.updatePet);

// Define GET/POST route to DELETE pets to database
router.get("/del-pet", requireAdmin, petsController.showDelForm);
router.post("/del-pet", requireAdmin, petsController.deletePet);

// EXPORT
module.exports = router;