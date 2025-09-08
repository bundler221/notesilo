const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  me,
  oauthSuccessRedirect,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// ---------------- Email/Password ----------------
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

// ---------------- Google OAuth ----------------
// Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth`,
    session: false,
  }),
  oauthSuccessRedirect   // ✅ use the controller instead of inline fn
);


// ---------------- Profile Management ----------------
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
