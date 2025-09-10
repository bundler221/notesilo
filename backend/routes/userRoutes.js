const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { searchUsers, getUserById } = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/search", searchUsers);   // GET /api/users/search?q=john
router.get("/:id", getUserById);      // GET /api/users/:id

module.exports = router;
