const express = require("express");
const app = express();
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const router = express.Router();
const Users = require("../Models/Users");
const Posts = require("../Models/Posts");
const { OAuth2Client } = require("google-auth-library");

async function googleLogin(req, res) {
  let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  const audience = payload.aud;

  if (audience === GOOGLE_CLIENT_ID) {
    Users.findOne({
      email: payload.email,
    })
      .then((response) => {
        console.log(response);
        if (!response) {
          Users.create({
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            loginType: "google",
          })
            .then((response) => {
              const token = jwt.sign(
                {
                  email: response.email,
                  id: response.id,
                },
                "secret"
              );
              res.status(200).json({ response: response, token: token });
            })
            .catch((error) => {
              res.status(400).json({ status: 400, message: error });
            });
        } else {
          if (response.loginType === "google") {
            const token = jwt.sign(
              {
                email: response.email,
                id: response.id,
              },
              "secret"
            );
            res
              .status(200)
              .json({ status: 200, response: response, token: token });
          } else {
            res.status(422).json({
              status: 422,
              message: "Email address already in use",
              type: "google",
            });
          }
        }
      })
      .catch((error) => {
        res.status(400).json({ status: 400, message: error });
      });
  }
}

function facebookLogin(req, res) {
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
        res
          .status(422)
          .json(
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
    .then((response1) => {
      console.log(response1);
      Users.findOne({
        email: response1.email,
      })
        .then((response) => {
          if (!response) {
            Users.create({
              firstName: response1.first_name,
              lastName: response1.last_name,
              email: response1.email,
              loginType: "facebook",
            })
              .then((response) => {
                const token = jwt.sign(
                  {
                    email: response1.email,
                    id: response1.id,
                  },
                  "secret"
                );
                res.status(200).json({ response: response, token: token });
              })
              .catch((error) => res.status(400).json(error));
          } else {
            if (response.loginType === "facebook") {
              const token = jwt.sign(
                {
                  email: response.email,
                  id: response.id,
                },
                "secret"
              );
              res.status(200).json({ response: response, token: token });
            } else {
              res.status(422).json({
                status: 422,
                message: "Email address already in use",
                type: "facebook",
              });
            }
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
router.post("/social-login", (req, res) => {
  if (req.body.loginType === "facebook") {
    facebookLogin(req, res);
  } else {
    googleLogin(req, res);
  }
});

router.get("/check-email", (req, res) => {
  Users.findOne({
    email: req.headers.email,
  })
    .then((response) => {
      console.log(response);
      if (response) {
        if (response.loginType !== "custom") {
          res.status(422).json({
            status: 422,
            message: `This user registered by ${response.loginType} login so use another email address.`,
          });
        } else {
          res.status(200).json({ status: 200, response: response });
        }
      } else {
        res.status(200).json({ status: 200, response: response });
      }
    })
    .catch((error) => {
      res.status(400).json({ status: 400, message: error });
    });
});

router.get("/signin", (req, res) => {
  Users.findOne({
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
          res.status(403).json({ status: 403, message: "Incorrect Password" });
        }
      });
    })
    .catch((error) => {
      res.status(403).json({ status: 404, message: error });
    });
});

router.post("/signup", (req, res) => {
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
      res.status(200).json({ status: 200, response: response, token: token });
    })
    .catch((error) => {
      res
        .status(409)
        .json({ status: 409, message: "Email address exist already" });
    });
});

module.exports = router;
