// Handles reading records from pet-data.json file by utilising the file system (fs)
const fs = require("node:fs/promises");
const filePath = "./data/pet-data.json";

// Read files
exports.getAllRecords = async () => {
  try {
    // Read data entries
    const rawData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(rawData);

  // When error occurs (if file does not exists)
  } catch (error) {
    console.error("Error reading posts file:", error);
    throw error;
  }
};