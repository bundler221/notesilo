const mongoose = require("mongoose");

const sharedWithSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accessLevel: { type: String, enum: ["read", "write", "comment"], default: "read" },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" }, // Markdown / text
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sharedWith: [sharedWithSchema],          // for RBAC
    tags: [{ type: String, index: true }],
    images: [String],                        // Cloudinary URLs (later)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
