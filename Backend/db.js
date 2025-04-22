const mongoose = require("mongoose");
require("dotenv").config();
// define mongoDB connection url
// const mongoURL = process.env.MONGO_LOCAL_URL;
const mongoURL = process.env.MONGO_URL_DEPLOY;

// set up MonogDB connection (compulsary)

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: false,
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }

  // Event listeners
  const db = mongoose.connection;

  db.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });
};

module.exports = connectDB;
