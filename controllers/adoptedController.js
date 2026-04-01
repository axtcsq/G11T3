const adopted = require('./../models/adoptedModel');
const Pet = require('./../models/petsModel');
const Favourite = require('./../models/favouritesModel');
const appointment = require('./../models/appointmentModel'); 

// Helper function to fetch all appointments
const getExistingAppointments = async () => {
    return await appointment.retrieveAll({}); 
};

exports.displayAdopted = async (req, res) => {
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
        res.render("adopted-pets", {
            isAdmin: isAdmin,
            pet: lastPet,
            userName: userName,
            bookedSlots: bookedSlots // Passed to EJS for the conflict-checking logic
        });


    } catch (error) {
        console.error("Error in displayAdopted:", error);
        res.status(500).send("Error reading database");
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
  

  // When successful
  try {
    await adopted.editAdopted (id, newName, status);
    let updatedAdopted = await adopted.findByID(id)

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
