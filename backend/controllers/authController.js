const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ---------------- AUTH ----------------

// Register with email/password
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email & password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email: email.toLowerCase(), passwordHash: hash });

    const token = signToken(user);
    res.json({
      msg: "Registered",
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ msg: "Register error", error: err.message });
  }
};

// Login with email/password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash || "");
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      msg: "Login success",
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

// Current user
exports.me = async (req, res) => {
  res.json({ user: req.user });
};

// Google OAuth success
// Google OAuth success
exports.oauthSuccessRedirect = (req, res) => {
  try {
    console.log("🔑 Google OAuth callback triggered");
    console.log("👤 User from passport:", req.user);

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("✅ Token generated:", token);

    // Send both token and username in query params
    const redirectUrl = `${process.env.CLIENT_URL}/oauth-success?token=${token}&username=${encodeURIComponent(req.user.username)}`;

    console.log("🌐 Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ OAuth redirect error:", err);
    res.status(500).send("OAuth redirect failed");
  }
};


// ---------------- PROFILE ----------------

// Update user details (username, etc.)
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Update profile error", error: err.message });
  }
};

// Update password (only if email/password user)
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.passwordHash) {
      return res.status(400).json({ msg: "Google accounts cannot set password" });
    }

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: "Old password incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Password update error", error: err.message });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Account deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete account error", error: err.message });
  }
};
