const User = require("../model/User");
const Note = require("../model/Note");

// Delete user + their notes
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // delete notes
    await Note.deleteMany({ owner: userId });

    // delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User and their data deleted" });
  } catch (err) {
    console.error("❌ Delete user failed:", err);
    res.status(500).json({ msg: "Delete user failed", error: err.message });
  }
};
