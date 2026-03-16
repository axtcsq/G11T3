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

// -----------------------------------------------------------------------------------------------------------------------

// Add pet records
exports.showAddForm = async (req, res) => {
  let result = "";
  let msg = "";

  res.render("add-pet", {result, msg}); // Render the EJS form view and pass the posts
}

exports.createPet = async (req, res) => {
  // Retrieves form data
  const data = req.body;

  const name = data.name;
  const type = data.type;
  const age = data.age;
  const desc = data.desc;

  // Create a structure that stores the new pet
  let newPet = {
    name: name,
    type: type,
    age: age,
    desc: desc
  }

  // Validation: Handles invalid fields
  if (!name || !type || !age || !desc) {
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