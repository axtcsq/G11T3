// Get Service model
const Pet = require('./../models/petsModel');

// Controller function to get all the documents in the db and display it
exports.showPets = async (req, res) => {
  try {
    let petList = await Pet.retrieveAll();// fetch all the list    
    console.log(petList);

    res.render("display-pet", { petList }); // Render the EJS form view and pass the posts

  } catch (error) {
    console.error(error);
    
    res.send("Error reading database"); // Send error message if fetching fails
  }
};