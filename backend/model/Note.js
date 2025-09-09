const mongoose = require("mongoose");

const sharedWithSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accessLevel: { type: String, enum: ["read", "write", "comment"], default: "read" },
  },
  { _id: false }
);

// New schema for references (connections between notes)
const referenceSchema = new mongoose.Schema(
  {
    fromHeading: { type: String, default: "" }, // Optional: e.g., "Introduction" in source note
    toNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true }, // Target note ID
    toHeading: { type: String, default: "" }, // Optional: e.g., "Conclusion" in target note
    type: { type: String, enum: ["link", "reference", "dependency"], default: "link" }, // Optional type for future filtering
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
    references: [referenceSchema],           // 👈 New: array of connections to other notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);