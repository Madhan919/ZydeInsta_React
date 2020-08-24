const express = require("express");
const app = express();
require("dotenv").config();
const fetch = require("node-fetch");
var cors = require("cors");
app.use(cors());
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const router = express.Router();
const Users = require("../Models/Users");
const { response } = require("express");
const { OAuth2Client } = require("google-auth-library");

function googleLogin(req, res) {
  let user;
  let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    const audience = payload.aud;

    if (audience === GOOGLE_CLIENT_ID) {
      user = new Users({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        loginType: "google",
      });
      Users.findOne({
        email: payload.email,
      })
        .then((response) => {
          if (!response) {
            user
              .save()
              .then((response) => {
                const token = jwt.sign(
                  {
                    email: response.email,
                    id: response.id,
                  },
                  "secret"
                );
                res.status(200).json({ data: response, token: token });
              })
              .catch((error) => {
                res.status(400).json({ status: 400, message: error });
              });
          } else {
            const token = jwt.sign(
              {
                email: response.email,
                id: response.id,
              },
              "secret"
            );
            res.status(200).json({ data: response, token: token });
          }
        })
        .catch((error) => {
          res.status(400).json({ status: 400, message: error });
        });
    }
  }
  verify().catch(res.status(400).json({ status: 400, message: error }));
}

function facebookLogin(req, res) {
  let user;
  const client_id = process.env.FACEBOOK_CLIENT_ID;
  const client_secret = process.env.FACEBOOK_SECRET_KEY;
  var code = req.body.idToken;
  var appToken;
  var url =
    "https://graph.facebook.com/oauth/access_token?client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&grant_type=client_credentials";
  return fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((response) => {
      appToken = response.access_token;
      if (appToken && code) {
        return fetch(
          "https://graph.facebook.com/debug_token?input_token=" +
            code +
            "&access_token=" +
            appToken,
          {
            method: "GET",
          }
        );
      }
    })
    .then((response) => response.json())
    .then((response) => {
      const { app_id, is_valid, user_id } = response.data;
      if (app_id != client_id) {
        res.send(
          "invalid app id: expected [" +
            client_id +
            "] but was [" +
            app_id +
            "]"
        );
      }
      if (!is_valid) {
        res.status(422).json({ status: 422, message: "Token is not valid" });
      }
      return fetch(
        "https://graph.facebook.com/v2.11/" +
          user_id +
          "?fields=id,first_name,last_name,picture,email&access_token=" +
          appToken,
        {
          method: "GET",
        }
      );
    })
    .then((response) => response.json())
    .then((response) => {
      user = new Users({
        firstName: response.first_name,
        lastName: response.last_name,
        email: "facebook@face.com",
        loginType: "facebook",
      });
      Users.findOne({
        email: "facebook@face.com",
      })
        .then((response) => {
          if (!response) {
            const instaUsers = user
              .save()
              .then((response) => {
                const token = jwt.sign(
                  {
                    email: response.email,
                    id: response.id,
                  },
                  "secret"
                );
                res.status(200).json({ data: response, token: token });
              })
              .catch((error) => res.send(error));
          } else {
            const token = jwt.sign(
              {
                email: response.email,
                id: response.id,
              },
              "secret"
            );
            res.status(200).json({ data: response, token: token });
          }
        })
        .catch((error) => {
          res.status(400).json({ status: 400, message: error });
        });
    })
    .catch((err) => {
      res.status(400).json({ status: 400, message: err });
    });
}
router.post("/social-login", (req, res, next) => {
  if (req.body.loginType === "facebook") {
    facebookLogin(req, res);
  } else {
    googleLogin(req, res);
  }
});

router.get("/check-email", async (req, res) => {
  await Users.findOne({
    email: req.headers.email,
  })
    .then((response) => {
      res.status(200).json({ status: 200, message: response });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});

router.get("/signin", async (req, res, next) => {
  await Users.findOne({
    email: req.headers.email,
  })
    .then((result) => {
      bcrypt.compare(req.headers.password, result.password, function (
        err,
        response
      ) {
        if (response == true) {
          const token = jwt.sign(
            {
              email: result.email,
              id: result.id,
            },
            "secret"
          );
          res
            .status(200)
            .json({ status: 200, message: response, token: token });
        } else {
          res.status(400).json({ status: 201, message: "Invalid Password" });
        }
      });
    })
    .catch((error) => {
      res.status(404).json({ status: 404, message: error });
    });
});

router.post("/signup", async (req, res, next) => {
  Users.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    loginType: req.body.loginType,
  })
    .then((response) => {
      const token = jwt.sign(
        {
          email: response.email,
          id: response.id,
        },
        "secret"
      );
      res.status(200).json({ status: 200, message: response, token: token });
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});

module.exports = router;
