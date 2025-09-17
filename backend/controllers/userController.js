const User = require("../model/User");

// Search users by email or username (for sharing UI)
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { email: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("username email _id")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Search failed", error: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username email _id");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email _id role createdAt");
    res.json(users);
  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    res.status(500).json({ msg: "Failed to fetch users", error: err.message });
  }
};

