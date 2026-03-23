const Favourite = require('./../models/favouritesModel');
const Pet = require("./../models/petsModel")

exports.addFavourite = async (req, res) => {
    const petID = req.query.petID
    // have to change when session is implemented
    let userName = "sam"

    let newFavourite = {
        userName: userName,
        petID: petID,
        remarks: ""
    }

    try {
        await Favourite.addFavourite(newFavourite)
        res.redirect("/display-pet")
    } catch(error) {
        console.log(error)
    }
}

exports.removeFavourite = async (req, res) => {
    const petID = req.query.petID
    // have to change when session is implemented
    let userName = "sam"

    try {
        await Favourite.removeFavourite(petID)
        res.redirect("/display-pet")
    } catch(error) {
        console.log(error)
    }
}

exports.showFavourites = async (req, res) => {
  try {
    // to change when session is implemented
    const userName = "sam"
    const isAdmin = true
    // get all favourite records for this user
    const favourites = await Favourite.findById(userName);

    // get all pets
    const petList = await Pet.retrieveAll();

    // combine only matching pets into a new array
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
            remark: favourites[i].remark
          });
        }
      }
    }

    res.render("view-favourites", {
      favouriteList,
      userName,
      isAdmin
    });

  } catch (error) {
    console.log(error);
    res.send("Error loading favourites");
  }
};

exports.editFavourite = async (req, res) => {
  try {
    const petID = req.query.petID;
    // to change when session is implemented
    const isAdmin = false;
    const userName = "sam";

    const favourite = await Favourite.findFavourite(userName, petID);

    res.render("edit-favourite", {
      favourite,
      userName,
      isAdmin
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading edit page");
  }
};

exports.updateFavourite = async (req, res) => {
  try {
    const id = req.body.id;
    // change when session is implemented
    const userName = "sam"
    let remark = req.body.remark;
    remark = remark.trim()

    await Favourite.editFavourite(
      userName,
      id,
      remark
    );

    res.redirect("/view-favourites");
  } catch (error) {
    console.log(error);
    res.send("Error updating favourite");
  }
};