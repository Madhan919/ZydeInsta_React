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
const Users = require("../Models/Users");
router.patch(
  "/change-profile",
  checkAuth,
  upload.single("photo"),
  (req, res, next) => {
    Users.findOneAndUpdate(
      { email: req.userData.email },
      { photo: req.file.filename }
    )
      .then((response) => {
        res.status(200).json({ status: 200, response: response });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, message: error });
      });
  }
);

router.delete("/remove-profile", checkAuth, (req, res, next) => {
  Users.findOneAndUpdate({ email: req.userData.email }, { photo: null })
    .then((response) => {
      fs.unlinkSync("post/" + req.headers.photo);
      res.status(200).json({
        status: 200,
        response: "Profile Photo Removed Successfully..!",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: 400, message: error });
    });
});

router.get("/change-profile", checkAuth, (req, res, next) => {
  Users.findOne({ email: req.userData.email })
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, response: error });
    });
});

router.post("/", checkAuth, upload.single("image"), (req, res, next) => {
  Posts.create({
    caption: req.headers.caption,
    image: req.file.filename,
    user: req.userData.id,
  })
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});
router.get("/view-profile", checkAuth, (req, res, next) => {
  let userId;
  let loggedUser = false;
  if (
    req.userData.id === req.headers.user ||
    req.headers.user === "undefined"
  ) {
    loggedUser = true;
    userId = req.userData.id;
  } else {
    loggedUser = false;
    userId = req.headers.user;
  }

  Posts.find({ user: userId })
    .populate("user")
    .then((response1) => {
      Users.findOne({ _id: userId })
        .then((response) => {
          res.status(200).json({
            status: 200,
            response: response1,
            user: response,
            logged: loggedUser,
          });
        })
        .catch((error) => {
          res.status(400).json({ status: 400, message: error });
        });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, error: error });
    });
});

router.get("/feeds", checkAuth, (req, res, next) => {
  Posts.find()
    .populate("user")
    .then((response) => {
      res.status(200).json({ status: 200, response: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});

router.delete("/delete-post", checkAuth, (req, res, next) => {
  Posts.findByIdAndDelete(req.headers.id)
    .then((response) => {
      fs.unlinkSync("post/" + req.headers.image);
      res.status(200).json({ status: 200, response: "Deleted Successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: 400, message: error });
    });
});

module.exports = router;
