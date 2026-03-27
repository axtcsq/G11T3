// Importing Express and Creating a Router
const express = require("express");
const { requireLogin, requireAdmin } = require("../middleware/auth");
const router = express.Router();

// Import the Controller files and functions in it.
const reviewsController = require("../controllers/reviewsController");

// Defining the CRUD routes
// Show all Reviews
router.get("/pet-reviews", requireLogin, reviewsController.showReviewsPage)

// Shows only My Reviews
router.get("/my-reviews", requireLogin, reviewsController.showMyReviews);

// Adding Reviews
router.get("/add-review", requireLogin, reviewsController.showForm)
router.post("/add-review", requireLogin, reviewsController.createReviews)

// Shows the Edit Form for One Review
router.get("/update-review", requireLogin, reviewsController.getReview)

// Updating a Review
router.post("/update-review/:id", requireLogin, reviewsController.updateReview)

// Delete Review
router.post("/delete-review", requireLogin, reviewsController.deleteReview)

// Search Reviews
router.get("/reviews/search", requireLogin, reviewsController.searchReviews)

// EXPORT
module.exports = router;