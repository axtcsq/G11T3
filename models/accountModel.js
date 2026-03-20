const mongoose = require("mongoose");

// Create a new pet' schema
const accountSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "A user must have a unique username"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
  },
  fullName: {
    type: String,
    required: [true, "A user must have a name"],
  },
  gender: {
    type: String,
    required: [true, "A user must have a gender"],
  },
  type: {
    type: String,
    required: [true, "A user must have a type"],
  }
});

const Account = mongoose.model("Account", accountSchema, "users");

// READ
exports.retrieveAll = function() {
    return Account.find();
};

// ADD
exports.addUser = function(newUser) {
    return Account.create(newUser);
};

// Search
exports.findByID = function(userName) {
    return Account.findOne({userName:userName});
};

// UPDATE
exports.editUser = function(userName, fullName, password, gender, type) {
    return Account.updateOne({userName}, {fullName, password, gender, type});
};

// DELETE
exports.deleteUser = function(userName) {
  return Account.deleteOne({userName})
};