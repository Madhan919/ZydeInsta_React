const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  follower: {
    type: String,
  },
  following: {
    type: String,
  },
  userFollower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  userFollowing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("Follows", userSchema);
