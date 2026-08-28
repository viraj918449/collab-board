// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB Atlas using the URI in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If successful, log the connection host to the terminal
    console.log(`MongoDB Connected: ${conn.connection.host} `);
  } catch (error) {
    // If it fails, log the exact error message so we can fix it
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;