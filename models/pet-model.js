// Handles reading records from stock-data.json file by utilising the file system (fs)
const fs = require("node:fs/promises");
const filePath = "./data/stock-data.json";

// Read files
exports.getAllRecords = async () => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading posts file:", error);
    throw error;
  }
};