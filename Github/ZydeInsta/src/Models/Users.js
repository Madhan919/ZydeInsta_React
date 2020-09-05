const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "FirstName should not be blank"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "LastName should not be blank"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email should not be blank"],
    unique: [true, "Email should be unique"],
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: [8, "Password length should be atleast 8"],
  },
  loginType: {
    type: String,
    trim: true,
    required: [true, "loginType should not be blank"],
  },
  photo: {
    type: String,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
