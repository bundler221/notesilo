const express = require("express");
const Note = require("../model/Note");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All graph data for the logged-in user
router.get("/all", protect, async (req, res) => {
  try {
    // Fetch all notes the user owns or has access to
    const notes = await Note.find({
      $or: [
        { owner: req.user._id },
        { "sharedWith.userId": req.user._id },
      ],
    }).lean();

    // Nodes: id + title
    const nodes = notes.map((note) => ({
      id: note._id.toString(),
      title: note.title || "Untitled",
    }));

    // Links: from note.references
    const links = [];
    notes.forEach((note) => {
      if (note.references && note.references.length > 0) {
        note.references.forEach((ref) => {
          links.push({
            source: note._id.toString(),
            target: ref.toNote.toString(),
            label: ref.fromHeading + " → " + ref.toHeading,
          });
        });
      }
    });

    res.json({ nodes, links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch graph", error: err.message });
  }
});

module.exports = router;
