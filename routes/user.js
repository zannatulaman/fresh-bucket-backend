const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Nodemailer setup

router.post("/register", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
      },
    });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
    });

    // Send OTP email
    transporter.sendMail(
      {
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: "Verify OTP",
        text: `Your verification OTP is ${otp}`,
      },
      (err) => {
        if (err) {
          console.error("Error sending email:", err);
          return res.status(500).json({ message: "Error sending OTP email" });
        }
        console.log("OTP sent successfully");
      }
    );

    // Save user
    await newUser.save();

    // Generate JWT token
    const payload = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User successfully created!",
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const isExistUser = await User.findOne({ email });

    if (!isExistUser) {
      throw new Error("User not Exist");
    }

    if (isExistUser.isVerified) {
      throw new Error("User already verified");
    }

    const isMatched = isExistUser.otp === otp;
    if (!isMatched) {
      throw new Error("Your otp is not matched");
    }

    isExistUser.isVerified = true;
    isExistUser.otp = "";

    await isExistUser.save();

    res.status(200).json({
      success: true,
      message: "User successfully verified",
      data: isExistUser,
    });
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
});

router.post("/forget-password", async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
      },
    });

    const { email } = req.body;

    const isExistUser = await User.findOne({ email });

    if (!isExistUser) {
      throw new Error("Enter your exiting email");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    isExistUser.otp=otp
    
    await isExistUser.save()

    // Send OTP email
    transporter.sendMail(
      {
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: "Reset password OTP",
        text: `Your verification OTP is ${otp}`,
        html: `<p>Your reset OTP  is ${otp} copy it </p><a href="http://localhost:3000/auth/reset-password?email=${email}&otp=${otp}">Click here to reset password</a>`,
      },
      (err) => {
        if (err) {
          console.error("Error sending email:", err);
          return res.status(500).json({ message: "Error sending OTP email" });
        }
        console.log("OTP sent successfully");
      }
    );
      

      res.status(200).json({
      success: true,
      message: "OTP sent successfully",
     
    });


  } catch (error) {
    console.log("Error", error);
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
     
       try {
         const { email, otp, password } = req.body;

         const isExistUser = await User.findOne({ email });

         if (!isExistUser) {
           throw new Error("User not found");
         }

         const isMatched = isExistUser.otp === otp;

         if (!isMatched) {
           throw new Error("Opt is not Matched");
         }

         // Hash password
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);

         isExistUser.password = hashedPassword;
         isExistUser.otp = "";

         await isExistUser.save();

         res.status(200).json({
           succcess: true,
           message: "Password reset successful",
           data: isExistUser,
         });
       } catch (error) {
             console.log('Error', error);
             next(error)
       }


})



module.exports = router;
