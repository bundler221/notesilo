const express = require("express");
const Note = require("../model/Note");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

// All graph data for the logged-in user
router.get("/all", async (req, res) => {
  try {
    // Fetch all notes the user owns or has access to (reuse logic from getMyNotes)
    const notes = await Note.find({
      $or: [
        { owner: req.user._id },
        { "sharedWith.userId": req.user._id },
      ],
    }).lean();

    // Nodes: id + title (add more props like tags for frontend coloring)
    const nodes = notes.map((note) => ({
      id: note._id.toString(),
      title: note.title || "Untitled",
      tags: note.tags || [], // Optional: for node styling
    }));

    // Links: from note.references
    const links = [];
    notes.forEach((note) => {
      if (note.references && note.references.length > 0) {
        note.references.forEach((ref) => {
          // Only include if target is also accessible to user (filter for privacy)
          const targetAccessible = notes.some(n => n._id.toString() === ref.toNote.toString());
          if (targetAccessible) {
            links.push({
              source: note._id.toString(),
              target: ref.toNote.toString(),
              label: (ref.fromHeading || "") + " → " + (ref.toHeading || ""), // Empty if no headings
            });
          }
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