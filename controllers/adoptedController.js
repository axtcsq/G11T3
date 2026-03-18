const adopted = require('./../models/adoptedModel');
const Pet = require('./../models/petsModel');

exports.displayAdopted = async (req, res) => {
  const isAdmin = req.body.admin
  const id  = req.body.selectPet
  const userName = req.body.userName
  let newAdopted = 
  { 
  userName: "sam",
  petId: id
  }

  try {

    //delete pet
    await Pet.delPet(id)

    //add adopted
    await adopted.addAdopted(newAdopted)


    res.render("adopted-pets",{isAdmin}); // Render the EJS form view and pass the posts

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
  