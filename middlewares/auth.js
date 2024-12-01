const jwt = require("jsonwebtoken");
require("dotenv").config();


//this middleware will checked token is valid or not
const auth = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    // throw new Error("Authorization Failed");
    return res.status(400).json({
        message: "Authorization failed"
    })
  }

  try {
    const decord = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decord.user;
    next()
  } catch (error) {
    console.log("Error", error);
    res.status(401).json({
        message : "Unauthorized"
    })
  }
};

module.exports = auth;
