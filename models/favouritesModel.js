const mongoose = require("mongoose");

const favouritesSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "User must exist"],
    },
    petID: {
        type: String,
        required: [true, "Pet ID must exist"],
    },
    remark: {
        type: String
    },
    priority: {
        type: String,
        default: "Medium"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Favourite = mongoose.model("Favourite", favouritesSchema, "favourites")

exports.retrieveAll = function() {
    return Favourite.find()
}

exports.findById = function(userName) {
    return Favourite.find({ userName: userName })
}

exports.findFavourite = function(userName, petID) {
    return Favourite.findOne({ userName: userName, petID: petID })
}

exports.additionalFavourite = function(newFav) {
    return Favourite.create(newFav)
}

exports.editFavourite = function(userName, petID, remark, priority) {
    return Favourite.updateOne({userName: userName, petID: petID}, {remark: remark, priority: priority})
}

exports.removeFavourite = function(userName, petID) {
    return Favourite.deleteOne({userName: userName, petID: petID })
}