require("dotenv").config();
const mongoose = require('mongoose');

let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is undefined in environment variables");
  }
  
  try {
    await mongoose.connect(uri);
    dbInstance = mongoose.connection;
    console.log("Connected to MongoDB 🚀");
    return dbInstance;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;