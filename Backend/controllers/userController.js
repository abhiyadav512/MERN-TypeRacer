const User = require("../models/userModel");
const cloudinary=require("../config/cloudinary");

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Ensure your auth middleware sets this
    const updateData = { ...req.body };

    // Handle file upload if exists
    if (req.file) {
      // Convert buffer to base64 string
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "user-profiles",
        public_id: userId, // Use user ID as public ID
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      updateData.profilePicture = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true, // Ensures schema validations run
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    let message = "Server error";
    if (error.name === "ValidationError") {
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    } else if (error.message.includes("File too large")) {
      message = "File size exceeds 5MB limit";
    } else if (error.message.includes("image format")) {
      message = "Only image files are allowed";
    }
    
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
