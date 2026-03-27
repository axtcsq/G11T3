const express = require("express");
const router = express.Router();

const { requireLogin, requireAdmin } = require("../middleware/auth");

const favouritesController = require("../controllers/favouritesController")

router.get("/add-favourite", requireLogin, favouritesController.addFavourite)
router.get("/remove-favourite", requireLogin, favouritesController.removeFavourite)

router.get("/view-favourites", requireLogin, favouritesController.showFavourites)
router.get("/delete-favourite", requireLogin, favouritesController.deleteFavourite)

router.get("/edit-favourite", requireLogin, favouritesController.editFavourite);
router.post("/update-favourite", requireLogin, favouritesController.updateFavourite);

module.exports = router