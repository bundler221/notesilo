const Note = require("../model/Note");

exports.createNote = async (req, res) => {
  try {
    console.log(req.method);
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
    const userId = req.user._id;

    const notes = await Note.find({
      $or: [
        { owner: userId },
        { "sharedWith.userId": userId } // ✅ includes shared notes
      ]
    })
      .sort({ updatedAt: -1 })
      .lean(); // convert to plain JS objects so we can safely mutate

    // Add `canWrite` property based on ownership / accessLevel
    const enrichedNotes = notes.map((note) => {
      let canWrite = false;

      if (note.owner.toString() === userId.toString()) {
        canWrite = true;
      } else {
        const shared = note.sharedWith.find(
          (sw) => sw.userId.toString() === userId.toString()
        );
        if (shared && shared.accessLevel === "write") {
          canWrite = true;
        }
      }

      return {
        ...note,
        canWrite, // 👈 extra flag for frontend
      };
    });

    res.json(enrichedNotes);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};


exports.getNoteById = async (req, res) => {
  try {
    console.log(req.method);
    res.json(req.note); // set by access middleware
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    console.log(req.method);
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
    console.log(req.method);
    await req.note.deleteOne();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};

exports.shareNote = async (req, res) => {
  try {
    console.log(req.method);
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
