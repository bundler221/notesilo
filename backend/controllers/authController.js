const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email & password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email: email.toLowerCase(), passwordHash: hash });

    const token = signToken(user);
    res.json({ msg: "Registered", token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: "Register error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash || "");
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(user);
    res.json({ msg: "Login success", token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

// Called after Google OAuth success to redirect with token
exports.oauthSuccessRedirect = (req, res) => {
  // req.user is set by passport in the callback route
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const redirectUrl = `${process.env.CLIENT_URL}/oauth-success?token=${token}`;
  res.redirect(redirectUrl);
};
