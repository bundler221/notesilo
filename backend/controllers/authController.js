const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sendEmail } = require("../utils/mailer");

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ---------------- AUTH ----------------

// Register with email/password
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic checks
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ msg: "Invalid email format" });

    // Password strength
    if (password.length < 6)
      return res.status(400).json({ msg: "Password must be at least 6 characters" });

    // Optional: username
    if (username && (username.length < 3 || username.length > 20))
      return res.status(400).json({ msg: "Username must be 3-20 characters" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash: hash,
    });

    const token = signToken(user);

    sendEmail(
      user.email,
      "Welcome to Notesilo 🎉",
      `<p>Hello ${username || "User"},</p><p>Thanks for signing up! You're ready to take notes 🚀</p>`
    );

    res.json({
      msg: "Registered",
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ msg: "Register error", error: err.message });
  }
};


// Login with email/password
exports.login = async (req, res) => {
  try {
    console.log(req.url, req.method);
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash || "");
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      msg: "Login success",
      token,
      user: { id: user._id, email: user.email, username: user.displayName }
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

// Current user
exports.me = async (req, res) => {
  console.log(req.url, req.method);
  res.json({ user: req.user });
};

// Google OAuth success
// require jwt at top of file if not already:
// const jwt = require("jsonwebtoken");

exports.oauthSuccessRedirect = (req, res) => {
  try {
    console.log(req.url, req.method);
    const user = req.user;
    // robust fallback for username
    const username = (user && (user.username || user.displayName || user.email)) || "user";

    // create an explicit payload object (stringify _id)
    const payload = { id: String(user._id), username };

    console.log("🔎 Generating JWT payload:", payload);

    // sign the token with the explicit payload
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // quick sanity checks in server logs
    console.log("✅ Token generated (truncated):", token.slice(0, 24) + "...");
    console.log("🔓 Decoded token payload (server-side check):", jwt.decode(token));

    const redirectUrl = `${process.env.CLIENT_URL}/oauth-success?token=${token}&username=${encodeURIComponent(username)}`;
    console.log("➡️ Redirecting to:", redirectUrl);

    res.redirect(redirectUrl);
  } catch (err) {
    console.error("OAuth redirect error:", err);
    res.status(500).send("OAuth redirect failed");
  }
};







// ---------------- PROFILE ----------------

// Update user details (username, etc.)
exports.updateProfile = async (req, res) => {
  try {
    console.log(req.url, req.method);
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

    if (!user.passwordHash) return res.status(400).json({ msg: "Google accounts cannot set password" });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: "Old password incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    // ✉️ Notify
    sendEmail(
      user.email,
      "Your password has been changed 🔒",
      `<p>Hello ${user.username || "User"},</p><p>Your password was updated successfully. If this wasn't you, contact support immediately.</p>`
    );

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Password update error", error: err.message });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    console.log(req.url, req.method);
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "Account deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete account error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  console.log("Forgot password request received:", req.body);
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "No account with this email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      "Reset your password",
      `<p>Hello,</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    res.json({ msg: "Password reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Error sending reset link", error: err.message });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ msg: "Invalid request" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    await user.save();

    await sendEmail(
      user.email,
      "Your password was reset 🔑",
      `<p>Hello ${user.username || "User"},</p><p>Your password has been successfully reset.</p>`
    );

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ msg: "Password reset failed", error: err.message });
  }
};
