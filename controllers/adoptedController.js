const adopted = require('./../models/adoptedModel');

exports.displayAdopted = async (req, res) => {
  try {
    let adoptedList = await adopted.retrieveAll();// fetch all the list    
    console.log(adoptedList);

    res.render("adopted-pets",); // Render the EJS form view and pass the posts

  } catch (error) {
    console.error(error);
    
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

exports.createAdopted = (req, res) => {
  // Retrieves form data
  const data = req.body;

  const name = data.name;
  const petName = data.selectPet

  // Create a structure that stores the new pet
  let newPet = {
    name: name,
    type: type,
    age: age,
    desc: desc
  }
}
  