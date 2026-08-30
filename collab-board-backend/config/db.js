require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check MongoDB URI
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // Connect to MongoDB using Mongoose
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
      `Database Name: ${connection.connection.name}`
    );

    return connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;