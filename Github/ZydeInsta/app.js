const express = require("express");
require("dotenv/config");
const connectDB = require("./src/Database/Connection");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("post"));
connectDB();
const { connect } = require("mongoose");
const user = require("./src/Routes/Signup");
app.use("/", user);
const post = require("./src/Routes/Post");
const { static } = require("express");
app.use("/post", post);

const Follow = require("./src/Routes/Follow");
app.use("/", Follow);

app.listen(9000, () => console.log("Server Started Successfully...!"));
