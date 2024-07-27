const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique in the database
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

// Export the model to use it in other parts of the application
module.exports = User;
