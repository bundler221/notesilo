const Note = require("../model/Note");

// level: "read" | "write" | "owner"
function requireNoteAccess(level = "read") {
  return async function (req, res, next) {
    try {
      const noteId = req.params.id || req.body.noteId || req.params.noteId;
      if (!noteId) return res.status(400).json({ msg: "Note id missing" });

      const note = await Note.findById(noteId);
      if (!note) return res.status(404).json({ msg: "Note not found" });

      const isOwner = String(note.owner) === String(req.user._id);
      if (level === "owner" && !isOwner) return res.status(403).json({ msg: "Owner access required" });

      if (isOwner) {
        req.note = note;
        return next();
      }

      // Check shared access
      const share = note.sharedWith.find(s => String(s.userId) === String(req.user._id));
      if (!share) return res.status(403).json({ msg: "No access to this note" });

      if (level === "write" && !["write"].includes(share.accessLevel)) {
        return res.status(403).json({ msg: "Write access required" });
      }

      req.note = note;
      next();
    } catch (err) {
      res.status(500).json({ msg: "Access check failed", error: err.message });
    }
  };
}

module.exports = { requireNoteAccess };
