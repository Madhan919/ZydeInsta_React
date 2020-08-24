const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  postedTime: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Posts", userSchema);
