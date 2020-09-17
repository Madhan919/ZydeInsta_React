const express = require("express");
const app = express();
const checkAuth = require("../Authentication/check-auth");
const router = express.Router();

const Follow = require("../Models/Follows");

router.get("/getfollowing", checkAuth, (req, res) => {
  Follow.create({
    follower: req.headers.user,
    following: req.userData.id,
    userFollower: req.headers.user,
    userFollowing: req.userData.id,
  })
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: 400, message: error });
    });
});

router.delete("/following", checkAuth, (req, res) => {
  Follow.remove({ follower: req.headers.user }, { following: req.userData.id })
    .select("-password")
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});

router.get("/following", checkAuth, (req, res) => {
  Follow.find({
    $or: [{ follower: req.headers.user }, { following: req.headers.user }],
  })
    .populate("userFollowing")
    .populate("userFollower")
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});
router.get("/getFollowers", checkAuth, (req, res) => {
  Follow.find()
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});
module.exports = router;
