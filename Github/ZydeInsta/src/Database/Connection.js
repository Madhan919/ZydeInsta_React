const mongoose = require("mongoose");

const URI = process.env.CONNECTION_URL;

const conncetDB = async () => {
  await mongoose
    .connect(URI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .catch((error) => console.log(error));
  console.log("Database Connected...!");
};
module.exports = conncetDB;
