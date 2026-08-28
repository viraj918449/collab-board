require("dotenv").config();
const { MongoClient } = require("mongodb");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is undefined in environment variables");
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB 🚀");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;