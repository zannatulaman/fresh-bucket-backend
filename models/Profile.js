const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    dob: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    member: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("profile", profileSchema);