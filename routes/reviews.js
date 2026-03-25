// Importing Express and Creating a Router
const express = require("express");
const router = express.Router();

// Import the Controller files and functions in it.
const reviewsController = require("../controllers/reviewsController");

// Defining the CRUD routes
// Show all Reviews
router.get("/pet-reviews", reviewsController.showReviewsPage)

// Adding Reviews
router.get("/add-review", reviewsController.showForm)
router.post("/add-review", reviewsController.createReviews)

// Shows the Edit Form for One Review
router.get("/update-review", reviewsController.getReview)

// Updating a Review
router.post("/update-review", reviewsController.updateReview)

// Delete Review
router.post("/delete-review", reviewsController.deleteReview)

// Search Reviews
router.get("/reviews/search", reviewsController.searchReviews)

// EXPORT
module.exports = router;