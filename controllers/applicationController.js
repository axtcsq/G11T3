const application = require('./../models/applicationModel');
const Pet = require('../models/petsModel');
const Favourite = require('../models/favouritesModel');
const appointment = require('../models/appointmentModel'); 

// Helper function to fetch all appointments
const getExistingAppointments = async () => {
    return await appointment.retrieveAll({}); 
};

exports.displayapplication = async (req, res) => {
    const isAdmin = req.body.admin;
    const id = req.body.selectPet;
    const userName = req.body.userName;
    const source = req.body.source;

    // 1. Handle the case where no pet was selected
    if (!id) {
        if (source === "favourites") {
            const favourites = await Favourite.findById(userName);
            const petList = await Pet.retrieveAll();
            let favouriteList = [];

            for (let i = 0; i < favourites.length; i++) {
                for (let j = 0; j < petList.length; j++) {
                    if (favourites[i].petID === petList[j].id) {
                        favouriteList.push({
                            petID: petList[j].id,
                            type: petList[j].type,
                            name: petList[j].name,
                            age: petList[j].age,
                            desc: petList[j].desc,
                            photo: petList[j].photo,
                            remark: favourites[i].remark,
                            priority: favourites[i].priority,
                            dateAdded: favourites[i].dateAdded
                        });
                    }
                }
            }

            return res.render("view-favourites", {
                favouriteList,
                userName,
                isAdmin,
                error: "Please select 1 pet to adopt"
            });
        } else {
            let petList = await Pet.retrieveAll();
            let favouriteList = [];

            if (userName) {
                const favourites = await Favourite.findById(userName);
                for (let i = 0; i < favourites.length; i++) {
                    favouriteList.push(favourites[i].petID);
                }
            }
            return res.render("display-pet", { 
                petList, 
                isAdmin, 
                userName, 
                favouriteList, 
                error: "Please select 1 pet to adopt" 
            });
        }
    }

    // 2. Handle the successful path (Pet ID exists)
    try {
        // Fetch pet details
        let lastPet = await Pet.findByID(id);
        
        // Fetch all booked slots using the helper
        const bookedSlots = await getExistingAppointments();

        // Send ONE single render command with all required data
        // This prevents the "Headers already sent" error
        res.render("application-pets", {
            isAdmin: isAdmin,
            pet: lastPet,
            userName: userName,
            bookedSlots: bookedSlots // Passed to EJS for the conflict-checking logic
        });


    } catch (error) {
        console.error("Error in displayapplication:", error);
        res.status(500).send("Error reading database");
    }
};

exports.displayapplicationList = async (req,res) => {
  applicationList = await application.retrieveAll()
  res.render('application-list', {applicationList})
}
  
exports.showEdit = async (req, res) => {
  try {
      let applicationList = await application.retrieveAll();// fetch all the list    
      res.render("edit-application", { applicationList }); // Render the EJS form view and pass the posts
    
    } catch (error) {
      console.error(error);
      res.send("Error reading database"); // Send error message if fetching fails
    }
}

exports.getapplication = async (req, res) => {
  // Retrieve form data
  const data = req.query; // its a GET request
  const id = data.petId;

  try {
    // find() always return an Array of result
    // findOne will return 1 document
    // let result = await Pet.find({isbn:isbnNo}); // find a pet with its record id
    let result = await application.findByID(id); // find a pet with id
    res.render("update-application", {result:result || null, successful: false});
    
  } catch (error) {
    console.log(error);
  }
};

exports.updateapplication = async (req, res) => {
  // Retrieve form data
  const data = req.body;

  const id = data.id; // in the hidden field
  const status = data.status
  const newName = data.name;
  

  // When successful
  try {
    await application.editapplication (id, newName, status);
    let updatedapplication = await application.findByID(id)

    // to check the output of success
    // console.log(success);

    res.render("update-application", {successful: true, result: updatedapplication})
  // When unsuccessful
  } catch (error) {
    console.log(error);
  }
};

exports.showDelForm = async (req, res) => {
  let result = "";
  let msg = "";

  let applicationList = await application.retrieveAll()
  res.render("del-application", {applicationList, result, msg}); // Render the EJS form view and pass the posts
}

exports.delapplication = async (req, res) => {
  const recordID = req.body.recordID
  let applicationList = await application.retrieveAll()
  
  try{
      let result = await application.delapplication(recordID);
  
      if (result.deletedCount === 0){
        return res.render("del-application", { applicationList, result: "fail", msg: "application not found" });
      }
  
      res.render("del-application", { applicationList, result, msg:"application deleted successfully"});
    }
  
    catch(err){
        let result = "fail";
        let msg = "Error deleting record";
        console.log(err)
  
        res.render("del-application", {applicationList, result, msg})};
  
}
