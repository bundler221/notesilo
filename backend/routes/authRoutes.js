//authRoutes.js
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
    (req, res) => {
      console.log("🔑 Google OAuth callback triggered");
      console.log("👤 User from passport:", req.user);

      try {
        const token = jwt.sign(
          { id: req.user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        console.log("✅ Token generated:", token);

        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
      } catch (err) {
        console.error("❌ Error generating token:", err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=token`);
      }
    }
  );


  // ---------------- Profile Management ----------------
  router.put("/update-profile", protect, updateProfile);
  router.put("/update-password", protect, updatePassword);
  router.delete("/delete-account", protect, deleteAccount);

// In authRoutes.js
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ msg: "Invalid request" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by decoded.id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // update password (hash before saving)
    user.password = password;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Password reset failed" });
  }
});


  module.exports = router;
