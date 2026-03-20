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

    // 1. perform the database actions 
    //delete pet
    await Pet.delPet(id)
    //add adopted
    await adopted.addAdopted(newAdopted)

    // 2. FETCH the pet we just added to show it on the summary page
      // Assuming your adopted model has a way to get all adopted pets
      let adoptedList = await adopted.retrieveAll(); 
      
      // Grab the most recent one (the one we just added)
      const lastPet = adoptedList[adoptedList.length - 1];

      // 3. PASS 'pet' to the EJS
      res.render("adopted-pets", {
          isAdmin: isAdmin,
          pet: lastPet // This is the key! This stops the "pet is undefined" error
      });

  } catch (error) {
    console.error(error);
    
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

exports.displayAdoptedList = async (req,res) => {
  adoptedList = await adopted.retrieveAll()
  res.render('adopted-list', {adoptedList})
}
  