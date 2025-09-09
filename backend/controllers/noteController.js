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
      references: [], // Start empty
    });

    // Auto-add references from content
    await parseAndAddReferences(note, req.user._id);

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

async function findNoteByTitle(title) {
  console.log('Searching for title:', title);
  const note = await Note.findOne({ title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } });
  console.log('Result for title', title, ':', note ? note : 'Not found');
  return note;
}

async function parseAndAddReferences(note, userId) {
  console.log('Parsing content for note:', note._id, 'user:', userId);
  const content = note.content;
  const linkRegex = /\[\[([^\]#]+)(?:#([^\]]*))?\]\]/g;
  let match;
  const newRefs = [];

  while ((match = linkRegex.exec(content)) !== null) {
    const targetTitle = match[1].trim();
    const toHeading = match[2] ? match[2].trim() : "";
    console.log('Found link:', targetTitle, 'heading:', toHeading);
    if (targetTitle) {
      const targetNote = await findNoteByTitle(targetTitle);
      if (targetNote) {
        console.log('Found target note:', targetNote._id, 'owner:', targetNote.owner);
        if (String(targetNote.owner) === String(userId)) {
          const existingRef = note.references.find(r => String(r.toNote) === String(targetNote._id) && r.toHeading === toHeading);
          if (!existingRef) {
            newRefs.push({
              fromHeading: "",
              toNote: targetNote._id,
              toHeading,
              type: "link"
            });
          }
        } else {
          console.log('Owner mismatch for:', targetTitle);
        }
      } else {
        console.log('No note found for title:', targetTitle);
      }
    }
  }

  if (newRefs.length > 0) {
    console.log('Adding references:', newRefs);
    note.references.push(...newRefs);
    await note.save();
  } else {
    console.log('No new references to add');
  }
}



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
    if (typeof content === "string") {
      note.content = content;
      note.references = []; // Clear existing refs
      await parseAndAddReferences(note, req.user._id); // Parse new refs
    }
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


exports.addReference = async (req, res) => {
  try {
    console.log(req.method);
    const { toNoteId, fromHeading = "", toHeading = "" } = req.body;
    const note = req.note;
    const targetNote = await Note.findById(toNoteId);
    if (!targetNote) return res.status(400).json({ msg: "Target note not found" });
    if (String(targetNote.owner) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Cannot link to this note" });
    }
    const existing = note.references.find(r => String(r.toNote) === toNoteId);
    if (existing) return res.status(400).json({ msg: "Reference already exists" });
    note.references.push({ fromHeading, toNote: toNoteId, toHeading, type: "link" });
    await note.save();
    res.json({ msg: "Reference added", references: note.references });
  } catch (err) {
    res.status(500).json({ msg: "Add reference failed", error: err.message });
  }
};

exports.removeReference = async (req, res) => {
  try {
    console.log(req.method);
    const { toNoteId } = req.params;
    const note = req.note;

    note.references = note.references.filter(r => String(r.toNote) !== toNoteId);
    await note.save();
    res.json({ msg: "Reference removed", references: note.references });
  } catch (err) {
    res.status(500).json({ msg: "Remove reference failed", error: err.message });
  }
};