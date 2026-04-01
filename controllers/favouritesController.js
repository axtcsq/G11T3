const Favourite = require('./../models/favouritesModel');
const Pet = require("./../models/petsModel")

exports.addFavourite = async (req, res) => {
    const petID = req.query.petID
    // have to change when session is implemented
    const userName = req.session.user.username;

    let newFavourite = {
        userName: userName,
        petID: petID,
        remarks: "",
        priority: "Medium"
    }

    try {
        await Favourite.additionalFavourite(newFavourite)
        res.redirect("/display-pet")
    } catch(error) {
        console.log(error)
    }
}

exports.removeFavourite = async (req, res) => {
    const petID = req.query.petID
    // have to change when session is implemented
    const userName = req.session.user.username;

    try {
        await Favourite.removeFavourite(userName, petID)
        res.redirect("/display-pet")
    } catch(error) {
        console.log(error)
    }
}

exports.deleteFavourite = async (req, res) => {
    const petID = req.query.petID
    // have to change when session is implemented
    const userName = req.session.user.username;

    try {
        await Favourite.removeFavourite(userName, petID)
        res.redirect("/view-favourites")
    } catch(error) {
        console.log(error)
    }
}

exports.showFavourites = async (req, res) => {
  try {
    // to change when session is implemented
    const user = req.session.user;
    const userName = user.username;
    const isAdmin = user.type === "admin";
    const filterType = req.query.filterType
    // get all favourite records for this user
    const favourites = await Favourite.findById(userName);

    // get all pets
    let petList = await Pet.retrieveAll();

    if (filterType && filterType !== 'all'){
      petList = petList.filter(pet => pet.type.toLowerCase() === filterType)
    }
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
            photo: petList[j].photo,
            remark: favourites[i].remark,
            priority: favourites[i].priority,
            dateAdded: favourites[i].dateAdded
          });
        }
      }
    }

    res.render("view-favourites", {
      petList,
      favouriteList,
      userName,
      isAdmin,
      error: "",
      filterType
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
    const user = req.session.user;
    const userName = user.username;
    const isAdmin = user.type === "admin";

    const favourite = await Favourite.findFavourite(userName, petID);

    res.render("edit-favourite", {
      favourite,
      userName,
      isAdmin,
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
    const userName = req.session.user.username;
    let remark = req.body.remark;
    let priority = req.body.priority
    remark = remark.trim()

    await Favourite.editFavourite(
      userName,
      id,
      remark,
      priority
    );

    res.redirect("/view-favourites");
  } catch (error) {
    console.log(error);
    res.send("Error updating favourite");
  }
};