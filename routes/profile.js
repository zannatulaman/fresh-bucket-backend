const express = require("express");
const Profile = require("../models/Profile");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/create", auth, async (req, res) => {
  try {
    const { firstName, lastName, email, image, dob, phone, gender, member } =
      req.body;

    console.log("Req", req.user);

    const profile = new Profile({
      user: req.user.id,
      firstName,
      lastName,
      email,
      image,
      dob,
      phone,
      gender,
      member,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successful",
      data: profile,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/get-all-profile", async (req, res) => {
  try {
    const result = await Profile.find();

    res.status(200).json({
      success: true,
      message: "Profile updated successful",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.patch("/update/:id", auth, async (req, res) => {
  // const {email} = req.user

  const profileId = req.params.id;

  // console.log(profileId);

  const profileExist = await Profile.findById(profileId);

  if (!profileExist) {
    res.status(401).json({
      success: false,
      message: "Profile not found",
    });
  }

  const result = await Profile.findByIdAndUpdate(profileId, req.body, {
    new: true,
  });
  res.status(200).json({
    message: "Profile updated sucessfully",
    data: result,
  });
});

router.get("/get-profile", auth, async (req, res) => {
  try {
    // const token = req.header("auth-token");

    // const decord = jwt.verify(token, process.env.JWT_SECRET);

    // req.user = decord.user;

    const { email } = req.user;

    const profile = await Profile.findOne({ email });

    console.log('Profile', profile);

    if (!email) {
      res.status(401).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile successfully found!",
      profile,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
