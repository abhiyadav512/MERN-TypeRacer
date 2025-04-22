const express = require("express");
const passport = require("passport");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // On success, return the JWT token
    const token = req.user.token;
    res.redirect(
      `https://mern-type-racer.vercel.app/auth-success?token=${token}`
    );
  }
);

router.get("/google/success", (req, res) => {
  const token = req.query.token;

  // Respond with the token to the frontend
  if (token) {
    res.json({
      message: "Google login successful",
      token: token,
    });
  } else {
    res.status(400).json({ message: "Google login failed" });
  }
});

module.exports = router;
