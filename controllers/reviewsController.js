// Get Reviews Database
const Review = require("../models/reviewsModels");

// Show all reviews on one page
exports.showReviewsPage = async (req, res) => {
    //gets isAdmin from the URL which we put inside from the previous /login
    const isAdmin = req.query.admin
    try{
        let reviews = await Review.retrieveAllReviews() // Retrieving from Retrieve model
        console.log(reviews)
        res.render("pet-reviews", {
            isAdmin,
            reviews,
            currentUser: req.session.user || null
        }) // Render the EJS form view and pass the posts
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
    const { petName, rating, title, message } = req.body; // Get data from the form
    // Trim spaces from each input (prevents issues from accidental spaces)
    const trimmedPetName = (petName || "").trim();
    const trimmedTitle = (title || "").trim();
    const trimmedMessage = (message || "").trim();
    const trimmedRating = rating ? parseInt(rating) : null;

    // Validation: Checks if any field is empty or invalid
    if (!trimmedPetName || !trimmedTitle || !trimmedMessage || !trimmedRating) {
        let result = "fail";
        let msg = "All fields are required, and rating should be a number between 1 and 5.";

        // Send a response back to the user, rendering the 'add-review' page with the error message
        return res.render("add-review", { result, msg });
    }

    // Make sure a logged-in user exists in session before creating a review
    if (!req.session || !req.session.user || !req.session.user.username) {
        let result = "fail";
        let msg = "Please log in before submitting a review.";
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
        await Review.addReview({
            username: req.session.user.username,
            petName: trimmedPetName,
            rating: trimmedRating,
            title: trimmedTitle,
            message: trimmedMessage
        }); 

        // Redirect to the reviews page after successful creation
        res.redirect("/pet-reviews");
    } catch (error) {
        console.log(error);
        res.send("Error creating review");
    }
};

// Show the edit form for one review
exports.getReview = async (req, res) => {
    const id = req.query.id || req.params.id; // Works with /update-review?id=... and /update-review/:id

    try {
        const review = await Review.findReviewByID(id);

        if (!review) {
            return res.status(404).send("Review not found");
        }

        res.render("edit-review", {
            review,
            result: "",
            msg: ""
        });
    } catch (error) {
        console.log(error);
        res.send("Error fetching review for editing");
    }
};

// Updating One Review
exports.updateReview = async (req, res) => {
    const id = req.body.id || req.params.id || req.query.id; // Get the review ID from form body, params, or query
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
        const updatedReview = await Review.updateReview(
            id,
            trimmedTitle,
            trimmedMessage,
            trimmedRating,
            trimmedPetName
        );

        if (!updatedReview) {
            return res.status(404).send("Review not found");
        }

        // Redirect to the reviews page after updating the review
        res.redirect("/pet-reviews");
    } catch (error) {
        console.log(error);
        res.send("Error updating review");
    }
};

// Delete One review
exports.deleteReview = async (req, res) => {
    const id = req.body.id || req.params.id || req.query.id;
    try {
        const deletedReview = await Review.deleteReview(id);
        if (!deletedReview) return res.status(404).send("Review not found");
        res.redirect("/pet-reviews");
    } catch (error) {
        console.log(error);
        res.send("Error deleting review");
    }
}

// Search Function
exports.searchReviews = async (req, res) => {
    const query = req.query.query; // Get the search term from the query string

    if (!query) {
        return res.redirect("/pet-reviews"); // If no search term is provided, redirect to all reviews
    }

    try {
        // Call the searchReviews function from the model
        const reviews = await Review.searchReviews(query);

        // Render the reviews page with the search results
        res.render("pet-reviews", {
            reviews,
            currentUser: req.session.user || null
        });
    } catch (error) {
        console.log(error);
        res.send("Error searching reviews");
    }
};

// Edit Only My Reviews
exports.showMyReviews = async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.username) {
        return res.redirect("/login");
    }

    try {
        const username = req.session.user.username;
        const reviews = await Review.findReviewsByUsername(username);

        res.render("my-reviews", {
            reviews,
            currentUser: req.session.user || null
        });
    } catch (error) {
        console.log(error);
        res.send("Error fetching your reviews");
    }
};