const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User Must Exist!"]
    },
    petName: {
        type: String,
        required: [true, "Pet Must Exist!"]
    },
    rating: {
        type: Number,
        required: [true, "Please Give a Rating"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must not exceed 5"]
    },
    title: {
        type: String,
        required: [true, "Give it a Title"]
    },
    message: {
        type: String,
        required: [true, "Please Write a Review :)"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema, "reviews")

// CREATE
exports.addReview = function(newReview) {
    return Review.create(newReview);
};

// READ
exports.retrieveAllReviews = function() {
    return Review.find(); // Retrieves all reviews from the database
};
exports.findReviewByID = function(id) {
    return Review.findOne({ _id: id });
};
exports.findReviewsByUsername = function(username) {
    return Review.find({ username: username });
};

// SEARCH
exports.searchReviews = function(query){ // query is the text string that the user inputs
    return Review.find({
        $or:[ // $or is a MongoDB operator that allows you to specify multiple conditions, and it returns documents that match the query conditions.
            {petName: { $regex: query, $options: 'i' } }, // $regex is a MongoDB operator that allows you to perform regular expression (regex) pattern matching the queries.
            // $options: "i" makes the regex search case-insensitive. 
            {title: { $regex: query, $options: 'i' } },   // Case-insensitive search for title
            {message: { $regex: query, $options: 'i' } }  // Case-insensitive search for message
        ]
    })
}

// UPDATE
exports.updateReview = function(id, title, message, rating, petName) {
    return Review.updateOne(
    { _id: id }, // Finds the review by ID
    { title: title, message: message, rating: rating, petName: petName} // Updates the review fields
    );
};

// DELETE
exports.deleteReview = function(id) {
    return Review.deleteOne({ _id: id }); // Deletes the review by ID
};