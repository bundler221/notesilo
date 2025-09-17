const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");
const { deleteUser } = require("../controllers/adminController");

const router = express.Router();

// DELETE /api/admin/user/:id
router.delete("/user/:id", protect, requireAdmin, deleteUser);

module.exports = router;
