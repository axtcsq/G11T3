const mongoose = require("mongoose");

// Create a new pet' schema
const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A pet must have a name"],
  },
  type: {
    type: String,
    required: [true, "A pet must have a type"],
  },
  age: {
    type: Number,
    required: [true, "A pet must have an age"],
  },
  desc: {
    type: String,
    required: [true, "A pet must have a description"],
  }
});

const Pet = mongoose.model("Pet", petSchema, "records");

exports.retrieveAll = function() {
  return Pet.find();
};

// Ex 2
exports.addPet = function(newPet) {
    return Pet.create(newPet);
};