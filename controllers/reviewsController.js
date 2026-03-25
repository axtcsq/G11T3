// Get Reviews Database
const Review = require("../models/reviewsModels");

// Show all reviews on one page
exports.showReviewsPage = async (req, res) => {
    //gets isAdmin from the URL which we put inside from the previous /login
    const isAdmin = req.query.admin
    try{
        let reviews = await Review.retrieveAllReviews() // Retrieving from Retrieve model
        console.log(reviews)
        res.render("pet-reviews", {isAdmin, reviews}) // Render the EJS form view and pass the posts
    } catch (error) {
        console.log(error);
        res.send("Error fetching reviews!"); // Send error message if fetching fails
    }
}

// Show the Add Review Form
exports.showForm = (req, res) => {
    let result = "";
    let msg = "";
  res.render("add-review", {result, msg}); // Render the EJS form view and pass the posts
}


//  Create a new Review
exports.createReviews = async (req, res) => {
    const { username, petName, rating, title, message } = req.body; // Get data from the form
    // Trim spaces from each input (prevents issues from accidental spaces)
    const trimmedUsername = (username || "").trim();
    const trimmedPetName = (petName || "").trim();
    const trimmedTitle = (title || "").trim();
    const trimmedMessage = (message || "").trim();
    const trimmedRating = rating ? parseInt(rating) : null;

    // Validation: Checks if any field is empty or invalid
    if (!trimmedUsername || !trimmedPetName || !trimmedTitle || !trimmedMessage || !trimmedRating) {
        let result = "fail";
        let msg = "All fields are required, and rating should be a number between 1 and 5.";

        // Send a response back to the user, rendering the 'add-review' page with the error message
        return res.render("add-review", { result, msg });
    }

    // Rating should be between 1 and 5
    if (trimmedRating < 1 || trimmedRating > 5) {
        let result = "fail";
        let msg = "Rating must be between 1 and 5.";
        return res.render("add-review", { result, msg });
    }
    
    try {
        // Create a new review document
        const newReview = new Review({
            username,
            petName,
            rating,
            title,
            message
        });

        // Save the review to the database
        await newReview.save();

        // Redirect to the reviews page after successful creation
        res.redirect("/reviews");
    } catch (error) {
        console.log(error);
        res.send("Error creating review");
    }
};

// Show the edit form for one review
exports.getReview = async (req, res) => {
    const { id } = req.params; // Get the review ID from the URL parameters

    try {
        // Find the review by ID
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).send("Review not found");
        }

        // Render the edit page with the current review data
        res.render("edit-review", { review });
    } catch (error) {
        console.log(error);
        res.send("Error fetching review for editing");
    }
};

// Updating One Review
exports.updateReview = async (req, res) => {
    const { id } = req.params; // Get the review ID from the URL
    const { petName, title, rating, message } = req.body; // Get the updated data from the form
    
    // Trim spaces from the data to avoid issues with accidental spaces
    const trimmedPetName = (petName || "").trim();
    const trimmedTitle = (title || "").trim();
    const trimmedMessage = (message || "").trim();
    const trimmedRating = rating ? parseInt(rating) : null;

    // Validation: Checks if any field is empty or invalid
    if (!trimmedPetName || !trimmedTitle || !trimmedMessage || !trimmedRating) {
        let result = "fail";
        let msg = "All fields are required, and rating should be a number between 1 and 5.";
        
        // Send a response back to the user with the error message
        return res.render("edit-review", { result, msg, review: req.body });
    }

    // Rating should be between 1 and 5
    if (trimmedRating < 1 || trimmedRating > 5) {
        let result = "fail";
        let msg = "Rating must be between 1 and 5.";
        
        // Send a response back to the user with the error message
        return res.render("edit-review", { result, msg, review: req.body });
    }

    try {
        // Find the review by ID and update it with the new data
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { petName, title, rating, message },
            { new: true } // Returns the updated document
        );

        if (!updatedReview) {
            return res.status(404).send("Review not found");
        }

        // Redirect to the reviews page after updating the review
        res.redirect("/reviews");
    } catch (error) {
        console.log(error);
        res.send("Error updating review");
    }
};

// Delete One review
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) return res.status(404).send("Review not found");
        res.redirect("/reviews");
    } catch (error) {
        console.log(error);
        res.send("Error deleting review");
    }
}

// Search Function
exports.searchReviews = async (req, res) => {
    const query = req.query.query; // Get the search term from the query string

    if (!query) {
        return res.redirect("/reviews"); // If no search term is provided, redirect to all reviews
    }

    try {
        // Call the searchReviews function from the model
        const reviews = await Review.searchReviews(query);

        // Render the reviews page with the search results
        res.render("pet-reviews", { reviews });
    } catch (error) {
        console.log(error);
        res.send("Error searching reviews");
    }
};