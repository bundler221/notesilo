const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");

// ✅ only authenticated users can upload
router.post("/upload", protect, uploadImage);

module.exports = router;
