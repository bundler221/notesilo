const express = require("express");
const { searchUsers, getUserById, getAllUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/all", getAllUsers);   // ✅ this must be here
router.get("/search", searchUsers);
router.get("/:id", getUserById);

module.exports = router;

