// Get Service model
const Pet = require('./../models/petsModel');
const Favourite = require('./../models/favouritesModel');

// Controller function to get all the documents in the db and display it
// READ
exports.showPets = async (req, res) => {
  const user = req.session.user;
  const isAdmin = user && user.type === "admin";
  const userName = user ? user.username : null;

  try {
    let petList = await Pet.retrieveAll();// fetch all the list
    let favouriteList = [];
    console.log(petList);

    if (userName) {
      const favourites = await Favourite.findById(userName);
      for (let i = 0; i < favourites.length; i++) {
        favouriteList.push(favourites[i].petID);
      }
    }
    res.render("display-pet", { petList, isAdmin, userName, favouriteList }); // Render the EJS form view and pass the posts

  } catch (error) {
    console.error(error);
    
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

// -----------------------------------------------------------------------------------------------------------------------

// ADD
// Add pet records
exports.showAddForm = async (req, res) => {

  try {
  const petList = await Pet.retrieveAll();
  const newId = String(Math.max(0,...petList.map(petList=>parseInt(petList.id,10))) + 1).padStart(3,'0');
  
  let result = "";
  let msg = "";

  res.render("add-pet", {newId, result, msg}); // Render the EJS form view and pass the posts
} catch(error){
  console.error(error);
  res.render("add-pet", { newId: 1, result: "fail", msg: "Error loading form" });
}
};

exports.createPet = async (req, res) => {
  // Retrieves form data
  const data = req.body;

  const petList = await Pet.retrieveAll();
  const newId = String(Math.max(0,...petList.map(petList=>parseInt(petList.id,10))) + 1).padStart(3,'0');
  const name = (data.name || "").trim();
  const type = (data.type || "").trim();
  const age = (data.age || "").trim();
  const desc = (data.desc || "").trim();

  // Validation: Handles invalid fields
  if ( !name || !type || !age || !desc) {
    let result = null;
    let msg = "All fields are required";

    return res.render("add-pet", { newId, result: "fail", msg });
  }

  // Create a structure that stores the new pet
  let newPet = {
    id: newId,
    name: name,
    type: type,
    age: age,
    desc: desc
  }

  // NOTE: HAVE YET TO IMPLEMENT DUPLICATE ADDITION LOGIC (will need to add some sort of Pet ID as unique identifier)

  // When successful
  try {
    let result = await Pet.addPet(newPet);
    let msg = "Pet added successfully";
    res.render("add-pet", { newId, result, msg });

  // When fail
  } catch (error) {
      console.error(error);
      
      // Added as result will not be returned when operation is not successful
      let result = "fail";
      let msg = "Record ID already exists";

      res.render("add-pet", {newId: newId, result, msg});
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
    res.render("update-pet", {result:result || null, successful: false});
    
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
    await Pet.editPet (id, newName, newType, newAge, newDesc);
    let updatedPet = await Pet.findByID(id)
    // to check the output of success
    // console.log(success);

    res.render("update-pet", {successful: true, result: updatedPet})
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

  let petLists = await Pet.retrieveAll()
  res.render("del-pet", {petLists, result, msg}); // Render the EJS form view and pass the posts
}

exports.deletePet = async (req, res) => {
  const data = req.body;
  const recordID = data.recordID;

  let petLists = await Pet.retrieveAll() // fetch all the list    

  try{
    let result = await Pet.delPet(recordID);

    if (result.deletedCount === 0){
      return res.render("del-pet", { petLists, result: "fail", msg: "Pet not found" });
    }

    res.render("del-pet", { petLists, result, msg:"Pet deleted successfully"});
  }

  catch(err){
      let result = "fail";
      let msg = "Error deleting pet";

      res.render("del-pet", {petLists, result, msg})};
}
