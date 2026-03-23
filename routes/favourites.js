const express = require("express");
const router = express.Router();

const favouritesController = require("../controllers/favouritesController")

router.get("/add-favourite", favouritesController.addFavourite)
router.get("/remove-favourite", favouritesController.removeFavourite)
router.get("/view-favourites", favouritesController.showFavourites)
router.get("/edit-favourite", favouritesController.editFavourite);
router.post("/update-favourite", favouritesController.updateFavourite);

module.exports = router