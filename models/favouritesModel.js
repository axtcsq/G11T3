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

exports.addFavourite = function(newFav) {
    return Favourite.create(newFav)
}

exports.editFavourite = function(userName, petID, remark) {
    return Favourite.updateOne({userName: userName, petID: petID}, {remark: remark})
}

exports.removeFavourite = function(removeFav) {
    return Favourite.deleteOne({ petID: removeFav })
}