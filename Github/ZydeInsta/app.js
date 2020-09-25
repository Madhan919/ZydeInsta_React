const express = require("express");
require("dotenv/config");
const connectDB = require("./src/Database/Connection");
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.static("post"));
connectDB();
const { connect } = require("mongoose");
const user = require("./src/Routes/Signup");
app.use("/", user);
const post = require("./src/Routes/Post");
app.use("/post", post);
const Follow = require("./src/Routes/Follow");
app.use("/", Follow);

app.listen(9000, () => console.log("Server Started Successfully...!"));
