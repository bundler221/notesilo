const Note = require("../model/Note");

exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.create({
      title,
      content: content || "",
      tags: tags || [],
      owner: req.user._id,
      sharedWith: [],
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Create failed", error: err.message });
  }
};

exports.getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    res.json(req.note); // set by access middleware
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = req.note;
    if (typeof title === "string") note.title = title;
    if (typeof content === "string") note.content = content;
    if (Array.isArray(tags)) note.tags = tags;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await req.note.deleteOne();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};

exports.shareNote = async (req, res) => {
  try {
    const { userId, accessLevel } = req.body; // accessLevel: read | write | comment
    const note = req.note; // owner-only ensured by middleware

    const idx = note.sharedWith.findIndex(s => String(s.userId) === String(userId));
    if (idx >= 0) {
      note.sharedWith[idx].accessLevel = accessLevel || note.sharedWith[idx].accessLevel;
    } else {
      note.sharedWith.push({ userId, accessLevel: accessLevel || "read" });
    }

    await note.save();
    res.json({ msg: "Sharing updated", sharedWith: note.sharedWith });
  } catch (err) {
    res.status(500).json({ msg: "Share failed", error: err.message });
  }
};
