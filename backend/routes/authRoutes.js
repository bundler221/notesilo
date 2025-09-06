const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login, me, oauthSuccessRedirect } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Email/Password
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

// Google OAuth (no sessions)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth`, session: false }),
  (req, res) => {
    // req.user is set by passport
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    // If you prefer JSON (for popup flows), return res.json({ token })
  }
);

module.exports = router;
