// controllers/uploadController.js
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// configure cloudinary with v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// store files temporarily in /uploads
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

exports.uploadImage = [
  upload.single("image"),
  async (req, res) => {
    try {

        console.log("Cloudinary ENV check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY?.slice(0, 5) + "...",
});

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "notes",
      });

      // Delete local temp file
      fs.unlinkSync(req.file.path);

      res.json({ url: result.secure_url });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      res.status(500).json({ msg: "Upload failed" });
    }
  },
];
