// Get Service model
const Pet = require('./../models/petsModel');
const Favourite = require('./../models/favouritesModel');

// Controller function to get all the documents in the db and display it
// READ
exports.showPets = async (req, res) => {
  const user = req.session.user;
  const isAdmin = user && user.type === "admin";
  const userName = user ? user.username : null;
  const filterType = req.query.filterType || "all";

  try {
    let petList = await Pet.retrieveAll(); // fetch all pets

    if (filterType && filterType !== "all") {
      petList = petList.filter(pet => pet.type.toLowerCase() === filterType);
    }

    let favouriteList = [];
    if (userName) {
      const favourites = await Favourite.findById(userName);
      favouriteList = favourites.map(fav => fav.petID);
    }

    res.render("display-pet", {petList,isAdmin,userName,favouriteList,error: "",filterType});
  } catch (err) {
    console.error(err);
    res.send("Error reading database");
  }
};

// -----------------------------------------------------------------------------------------------------------------------

exports.displayPetDetails = async (req,res) => {
  try {
        // Get pet id from URL parameter
        const id = req.params._id;
        

        // Fetch the pet from the database
        const pet = await Pet.findByObjectID(id);

        if (!pet) {
            // If pet not found, send 404
            return res.status(404).send(`Pet not found!`);
        }

        // Render the pet-detail EJS page and pass the pet object
        res.render('pet-details', { pet });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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
  const gender = (data.gender || "").trim();
  const breed = (data.breed || "").trim();
  const colour = (data.colour || "").trim();
  const age = (data.age || "").trim();
  const desc = (data.desc || "").trim();
  const photo = req.file ? req.file.filename : "";

  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  // Validation: Handles invalid fields
  if ( !name || !type || !gender || !breed || !colour ||  !age || !desc || !photo) {
    let result = "fail";
    let msg = "All fields are required, including a photo";

    return res.render("add-pet", { newId, result, msg });
  }

  // Create a structure that stores the new pet
  let newPet = {
    id: newId,
    name: name,
    type: type,
    gender: gender,
    breed: breed,
    colour: colour,
    age: age,
    desc: desc,
    photo: photo
  }

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
};

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
    let result = await Pet.findByID(id); // find a pet with id
    res.render("update-pet", {result:result || null, successful: false});
    
  } catch (error) {
    console.log(error);
  }
};

exports.updatePet = async (req, res) => {
  try{
  
  // Retrieve form data
  const data = req.body;
  const id = data.id; // in the hidden field
  
  const existingPet = await Pet.findByID(id);
    if (!existingPet) {
      return res.send("Pet not found");
    }
  
  const newName = data.name;
  const newType = data.type;
  const newGender = data.gender;
  const newBreed = data.breed;
  const newColour = data.colour;
  const newAge = data.age;
  const newDesc = data.desc;

  const newPhoto = req.file ? req.file.filename : existingPet.photo;

  // When successful
 
    await Pet.editPet (id, newName, newType, newGender, newBreed, newColour, newAge, newDesc, newPhoto);
    const updatedPet = await Pet.findByID(id);
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
};

const fs = require("fs");
const path = require("path");

exports.deletePet = async (req, res) => {
  const data = req.body;
  const recordID = data.recordID;

  let petLists = await Pet.retrieveAll();

  try {
    const pet = await Pet.findByID(recordID);

    if (!pet) {
      return res.render("del-pet", {
        petLists,
        result: "fail",
        msg: "Pet not found"
      });
    }

    if (pet.photo) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        pet.photo
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const result = await Pet.delPet(recordID);

    if (result.deletedCount === 0) {{
      
    }
      return res.render("del-pet", {
        petLists,
        result: "fail",
        msg: "Pet not found"
      });
    }

    petLists = await Pet.retrieveAll();

    res.render("del-pet", {
      petLists,
      result,
      msg: "Pet deleted successfully"
    });

  } catch (err) {
    console.error(err);

    res.render("del-pet", {
      petLists,
      result: "fail",
      msg: "Error deleting pet"
    });
  }
};