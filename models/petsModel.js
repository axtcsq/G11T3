const mongoose = require("mongoose");

// Create a new pet' schema
const petSchema = new mongoose.Schema({
  id:   {
    type: String,
    required: [true, "A pet must have a record ID"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "A pet must have a name"],
  },
  type: {
    type: String,
    required: [true, "A pet must have a type"],
  },
  breed: {
    type: String,
    required: [true, "A pet must have a breed"],
  },
  colour: {
    type: String,
    required: [true, "What's the pet fur colour"],
  },
  age: {
    type: Number,
    required: [true, "A pet must have an age"],
  },
  desc: {
    type: String,
    required: [true, "A pet must have a description"],
  },
  photo:{
    type: String,
    required: [true, "A pet must have a photo attached"],
  }
});

const Pet = mongoose.model("Pet", petSchema, "records");

// READ
exports.retrieveAll = function() {
  return Pet.find();
};

// ADD
exports.addPet = function(newPet) {
    return Pet.create(newPet);
};

// Search
exports.findByID = function(id) {
    return Pet.findOne({ id:id });
};

exports.findByName = function(petName) {
    return Pet.findOne({ name: { $regex: `^${petName}$`, $options: 'i' } });
};

// UPDATE Website
exports.editPet = function(id, name, type, breed, colour, age, desc, photo) {
    return Pet.updateOne({id:id}, {$set: {name:name, type:type, breed:breed, colour:colour, age:age, desc:desc, photo:photo}});
};

// DELETE
exports.delPet = function(recordID) {
  return Pet.deleteOne({ id: recordID})
}