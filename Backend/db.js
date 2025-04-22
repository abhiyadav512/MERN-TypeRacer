const mongoose = require("mongoose");
require("dotenv").config();
// define mongoDB connection url
// const mongoURL = process.env.MONGO_LOCAL_URL;
const mongoURL = process.env.MONGO_URL_DEPLOY;

// set up MonogDB connection (compulsary)
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// get the default coo=nnection
const db = mongoose.connection;

// define event listners for database connection

db.on("connected", () => {
  console.log("connected to MongoDB server");
});

db.on("error", (error) => {
  console.log("some error in MongoDB", error);
});

db.on("disconnected", () => {
  console.log("MongoDB server diconnected");
});

// export the database
module.exports = db;
