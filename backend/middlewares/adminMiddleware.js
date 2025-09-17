// Ensure the logged-in user is an admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
}

module.exports = { requireAdmin };
