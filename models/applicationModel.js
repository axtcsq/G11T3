const mongoose = require("mongoose");

// Create a new application schema
const applicationSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User must exist"],
  },
  petId: {
    type: String,
    required: [true, "Pet id must exist"],
  },
  applicationAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "rejected"],
    default: "Pending"
  }

});

const application = mongoose.model("pet", applicationSchema, "application");

exports.retrieveAll = function() {
  return application.find();
};

exports.addapplication = function(newapplication) {
    return application.create(newapplication);
};

exports.findByID = function(id) {
    return application.findOne({ petId:id });
};
exports.findByObjectID = function(id) {
    return application.findOne({ _id:id });
};

exports.editapplication = function(id, name, status) {
    return application.updateOne({_id:id}, {userName:name, status: status});
};

exports.delapplication = function(id) {
  return application.deleteOne({_id: id})
}

