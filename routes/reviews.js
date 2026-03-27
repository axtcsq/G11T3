// Importing Express and Creating a Router
const express = require("express");
const router = express.Router();

// Import the Controller files and functions in it.
const reviewsController = require("../controllers/reviewsController");

// Defining the CRUD routes
// Show all Reviews
router.get("/pet-reviews", reviewsController.showReviewsPage)

// Shows only My Reviews
router.get("/my-reviews", reviewsController.showMyReviews);

// Adding Reviews
router.get("/add-review", reviewsController.showForm)
router.post("/add-review", reviewsController.createReviews)

// Shows the Edit Form for One Review
router.get("/update-review", reviewsController.getReview)

// Updating a Review
router.post("/update-review/:id", reviewsController.updateReview)

// Delete Review
router.post("/delete-review", reviewsController.deleteReview)

// Search Reviews
router.get("/reviews/search", reviewsController.searchReviews)

// EXPORT
module.exports = router;