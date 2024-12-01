const express = require("express");
const Profile = require("../models/Profile");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/create", auth,  async (req, res) => {
  try {

    const { firstName, lastName, email, dob, phone, gender, member } = req.body;

    console.log("Req", req.user);

    const profile = new Profile({
      user: req.user.id,
      firstName,
      lastName,
      email,
      dob,
      phone,
      gender,
      member
    });

    await profile.save()

    res.status(201).json({
         success: true,
         message: "Profile updated successful",
         data: profile
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
