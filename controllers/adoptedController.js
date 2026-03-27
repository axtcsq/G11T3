const adopted = require('./../models/adoptedModel');
const Pet = require('./../models/petsModel');

exports.displayAdopted = async (req, res) => {
  const isAdmin = req.body.admin
  const id  = req.body.selectPet
  const userName = req.body.userName
  console.log(req.session.user.username)

  if (!id) {
      const petList = await Pet.retrieveAll();
      return res.render ('display-pet', {petList, isAdmin, id, userName:userName, favouriteList:[], error: "Please select 1 pet to adopt"})
    }

  let newAdopted = 
  { 
  userName: req.session.user.username,
  petId: id,
  }

  try {

    // 1. perform the database actions 
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
  
exports.showEdit = async (req, res) => {
  try {
      let adoptedList = await adopted.retrieveAll();// fetch all the list    
      res.render("edit-adopted", { adoptedList }); // Render the EJS form view and pass the posts
    
    } catch (error) {
      console.error(error);
      res.send("Error reading database"); // Send error message if fetching fails
    }
}

exports.getAdopted = async (req, res) => {
  // Retrieve form data
  const data = req.query; // its a GET request
  const id = data.petId;

  try {
    // find() always return an Array of result
    // findOne will return 1 document
    // let result = await Pet.find({isbn:isbnNo}); // find a pet with its record id
    let result = await adopted.findByID(id); // find a pet with id
    res.render("update-adopted", {result:result || null, successful: false});
    
  } catch (error) {
    console.log(error);
  }
};

exports.updateAdopted = async (req, res) => {
  // Retrieve form data
  const data = req.body;

  const id = data.id; // in the hidden field
  const status = data.status
  const newName = data.name;
  console.log(newName)

  // When successful
  try {
    await adopted.editAdopted (id, newName, status);
    let updatedAdopted = await adopted.findByID(id)
    console.log(updatedAdopted)
    // to check the output of success
    // console.log(success);

    res.render("update-adopted", {successful: true, result: updatedAdopted})
  // When unsuccessful
  } catch (error) {
    console.log(error);
  }
};

exports.showDelForm = async (req, res) => {
  let result = "";
  let msg = "";

  let adoptedList = await adopted.retrieveAll()
  res.render("del-adopted", {adoptedList, result, msg}); // Render the EJS form view and pass the posts
}

exports.delAdopted = async (req, res) => {
  const recordID = req.body.recordID
  let adoptedList = await adopted.retrieveAll()
  console.log(recordID)
  try{
      let result = await adopted.delAdopted(recordID);
  
      if (result.deletedCount === 0){
        return res.render("del-adopted", { adoptedList, result: "fail", msg: "Adopted not found" });
      }
  
      res.render("del-adopted", { adoptedList, result, msg:"Adopted deleted successfully"});
    }
  
    catch(err){
        let result = "fail";
        let msg = "Error deleting record";
        console.log(err)
  
        res.render("del-adopted", {adoptedList, result, msg})};
  
}
