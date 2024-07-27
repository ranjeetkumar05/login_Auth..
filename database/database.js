const mongoose = require("mongoose");
const User = require("../Models/user"); // Adjust the path as needed

// MongoDB connection URI
const uri =
  "mongodb+srv://ranjeetsigh001:jbUbusgAwajGysQL@cluster0.1wfjpmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}
async function addUser(name, email, password) {
  try {
    // Create a new user document
    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });

    // Save the new user document to the database
    await newUser.save();
    console.log("User saved successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    throw err; // Propagate the error
  }
}

module.exports = addUser;
connectToDatabase();
