// Get Service model
const Pet = require('./../models/petsModel');

// Controller function to get all the documents in the db and display it
// READ
exports.showPets = async (req, res) => {
  //gets isAdmin from the URL which we put inside from the previous /login
  const isAdmin = req.query.admin
  try {
    let petList = await Pet.retrieveAll();// fetch all the list    
    console.log(petList);

    res.render("display-pet", { petList, isAdmin }); // Render the EJS form view and pass the posts

  } catch (error) {
    console.error(error);
    
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

// -----------------------------------------------------------------------------------------------------------------------

// ADD
// Add pet records
exports.showAddForm = async (req, res) => {
  let result = "";
  let msg = "";

  res.render("add-pet", {result, msg}); // Render the EJS form view and pass the posts
}

exports.createPet = async (req, res) => {
  // Retrieves form data
  const data = req.body;

  const id = data.id;
  const name = data.name;
  const type = data.type;
  const age = data.age;
  const desc = data.desc;

  // Create a structure that stores the new pet
  let newPet = {
    id: id,
    name: name,
    type: type,
    age: age,
    desc: desc
  }

  // Validation: Handles invalid fields
  if (!id || !name || !type || !age || !desc) {
    let result = null;
    let msg = "All fields are required";

    res.render("add-pet", { result, msg });
  }

  // NOTE: HAVE YET TO IMPLEMENT DUPLICATE ADDITION LOGIC (will need to add some sort of Pet ID as unique identifier)

  // When successful
  try {
    let result = await Pet.addPet(newPet);
    let msg = "Pet added successfully";

    res.render("add-pet", { result, msg });

  // When fail
  } catch (error) {
      console.error(error);
      
      // Added as result will not be returned when operation is not successful
      let result = "fail";
      let msg = "Error creating pet";

      res.render("add-pet", {result, msg});
  }
}

// -----------------------------------------------------------------------------------------------------------------------
// UPDATE
// READ
// Controller function to get all the documents in the db and display it
exports.showPetList = async (req, res) => {
  try {
    let petList = await Pet.retrieveAll();// fetch all the list    
    console.log(petList);
    res.render("edit-pet", { petList }); // Render the EJS form view and pass the posts
  
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

exports.getPet = async (req, res) => {
  // Retrieve form data
  const data = req.query; // its a GET request
  const id = data.id;

  try {
    // find() always return an Array of result
    // findOne will return 1 document
    // let result = await Pet.find({isbn:isbnNo}); // find a pet with its record id
    let result = await Pet.findByID(id); // find a pet with id
    res.render("update-pet", {result:result || null});
    
  } catch (error) {
    console.log(error);
  }
};

exports.updatePet = async (req, res) => {
  // Retrieve form data
  const data = req.body;

  const id = data.id; // in the hidden field

  const newName = data.name;
  const newType = data.type;
  const newAge = data.age;
  const newDesc = data.desc;

  // When successful
  try {
    let success = await Pet.editPet (id, newName, newType, newAge, newDesc);
    console.log(success);

    res.send("Pet has been successfully updated.")
  // When unsuccessful
  } catch (error) {
    console.log(error);
  }
};

// -----------------------------------------------------------------------------------------------------------------------

// DELETE
exports.showDelForm = async (req, res) => {
  let result = "";
  let msg = "";

  res.render("del-pet", {result, msg}); // Render the EJS form view and pass the posts
}

exports.deletePet = async (req, res) => {
  const data = req.body;
  const name = data.name;
  try{
    let result = await Pet.delPet(name);

    if (result.deletedCount === 0){
      return res.render("del-pet", { result: "fail", msg: "Pet not found" });
    }
    res.render("del-pet", { result, msg:"Pet deleted successfully"});
  }
  catch{
      let result = "fail";
      let msg = "Error deleting pet";
      res.render("del-pet", {result, msg});
  }
}

