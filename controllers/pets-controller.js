// Tells the controller how to get the data
const Pet = require("../models/pet-model");

// showForm function (change this)
exports.showForm = async (req, res) => {
    
    const x = await Pet.getAllRecords();
        
    res.render("main", { });
}

// whtvr other functions
// exports.x = async (req, res) => {
    
//     const x = await Pet.get();
        
//     res.render("blog", { });
// }