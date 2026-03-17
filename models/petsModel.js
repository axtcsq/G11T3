const mongoose = require("mongoose");

// Create a new pet' schema
const petSchema = new mongoose.Schema({
  id:   {
    type: String,
    required: [true, "A pet must have a record ID"],
  },
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

// UPDATE
exports.editPet = function(id, name, type, age, desc) {
    return Pet.updateOne({id:id}, {name:name, type:type, age:age, desc:desc});
};

// DELETE
exports.delPet = function(name) {
  return Pet.deleteOne({name})
}