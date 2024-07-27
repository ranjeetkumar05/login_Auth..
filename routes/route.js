const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user"); // Ensure this path is correct
const authenticateToken = require("../middleware/Auth"); // Ensure this path is correct

// Display login form
router.get("/", (req, res) => {
  res.render("home"); // Assuming login.ejs is in your views folder
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("register", { errorMessage: "Email already exists" });
    }

    // Validate the password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.render("register", {
        errorMessage:
          "Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the new user document to the database
    await newUser.save();
    console.log("User registered successfully");

    // Redirect to a success page or login page
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.render("register", { errorMessage: "Server error" });
  }
});

// Display registration form
router.get("/register", (req, res) => {
  res.render("register"); // Assuming register.ejs is in your views folder
});

// Display login form
router.get("/login", (req, res) => {
  res.render("login"); // Assuming login.ejs is in your views folder
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render("login", { errorMessage: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render("login", { errorMessage: "Invalid password" });
    }

    // Issue JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSecret =
      "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd"; // Hardcoded JWT secret
    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { httpOnly: true }); // Set cookie with JWT token
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.render("login", { errorMessage: "Server error" });
  }
});

router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("dashboard", { user });
  } catch (error) {
    res.render("login", { user });

    console.error("Error fetching user:", error);
    res.status(500).send("Server error");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.redirect("/login"); // Redirect to login page after logout
});
module.exports = router;
