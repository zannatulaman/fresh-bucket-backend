const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
      console.log('email', email);


    if (!email || !password) {
      // throw new Error("Email and password are required");
        res.status(401).json({
          success: false,
          message: "Email and password are required",
        });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      // throw new Error("User not found");
      res.status(401).json({
             success: false,
             message: "User not found" 
      })
    }

    //matching the password

    console.log('User', user);

    const isMatched = await bcrypt.compare(password, user.password);

    console.log("isMatched", isMatched);

    if (!isMatched) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15d" },
      function (err, token) {
        // console.log(token);

        if (err) {
          throw new Error("Failed to create user");
        }

        res.status(200).json({
          success: true,
          message: "User successfully logged in!",
          token,
        });
      }
    );
  } catch (error) {
    console.log("Error", error);
    next(error);
    // res.status(500).json({ message: "Server Error" })
  }
});

module.exports = router;
