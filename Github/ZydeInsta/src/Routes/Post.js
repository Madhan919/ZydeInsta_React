const express = require("express");
const app = express();
const checkAuth = require("../Authentication/check-auth");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./post/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});
const upload = multer({ storage: storage });
const Posts = require("../Models/Posts");
const Profile = require("../Models/Users");
router.patch(
  "/change-profile",
  checkAuth,
  upload.single("photo"),
  (req, res, next) => {
    Profile.findOneAndUpdate(
      { email: req.userData.email },
      { photo: req.file.filename }
    )
      .then((response) => {
        res.status(200).json({ status: 200, message: response });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, message: error });
      });
  }
);

router.delete(
  "/remove-profile",
  checkAuth,
  upload.single("photo"),
  (req, res, next) => {
    Profile.findOneAndUpdate({ email: req.userData.email }, { photo: null })
      .then((response) => {
        fs.unlinkSync("post/" + req.headers.photo);
        res.status(200).json({
          status: 200,
          message: "Profile Photo Removed Successfully..!",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
      });
  }
);

router.get(
  "/change-profile",
  checkAuth,
  upload.single("photo"),
  async (req, res, next) => {
    await Profile.findOne({ email: req.userData.email })
      .then((response) => {
        res.status(200).json({ status: 200, message: response });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, message: error });
      });
  }
);

router.post("/", checkAuth, upload.single("image"), async (req, res, next) => {
  Posts.create({
    caption: req.headers.caption,
    image: req.file.filename,
    user: req.userData.id,
  })
    .then((response) => {
      res.status(200).json({ status: 200, message: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});
router.get(
  "/view-profile",
  checkAuth,
  upload.single("image"),
  async (req, res, next) => {
    let userId;
    let loggedUser = false;
    if (req.headers.type === "unknown") {
      userId = req.headers.user;
    } else {
      userId = req.userData.id;
      loggedUser = true;
    }
    if (req.headers.user === req.userData.id) {
      loggedUser = true;
    }
    await Posts.find({ user: userId })
      .populate("user")
      .then((response) => {
        res
          .status(200)
          .json({ status: 200, message: response, logged: loggedUser });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, error: error });
      });
  }
);

router.get(
  "/feeds",
  checkAuth,
  upload.single("image"),
  async (req, res, next) => {
    await Posts.find()
      .populate("user")
      .then((response) => {
        res.status(200).json({ status: 200, message: response });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, message: error });
      });
  }
);

router.delete(
  "/delete-post",
  checkAuth,
  upload.single("image"),
  async (req, res, next) => {
    await Posts.findByIdAndDelete(req.headers.id)
      .then((response) => {
        fs.unlinkSync("post/" + req.headers.image);
        res.status(200).json({ status: 200, message: "Deleted Successfully" });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
      });
  }
);

module.exports = router;
