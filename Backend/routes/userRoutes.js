const express = require("express");
const multer = require("multer");
const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Get Profile
router.get("/profile", authMiddleware , getProfile);

// Update Profile
router.put("/profile", authMiddleware,upload.single("image"), updateProfile);


module.exports = router;
