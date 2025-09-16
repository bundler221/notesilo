const Note = require("../model/Note");
const User = require("../model/User");

// routes/notes.js or wherever your backend is

const axios = require("axios");

exports.createNote = async (req, res) => {
  try {
    console.log(req.url, req.method);
    const { title, content, tags } = req.body;

    // 🔒 Enforce unique title per user
    const existing = await Note.findOne({
      owner: req.user._id,
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") } // case-insensitive
    });
    if (existing) {
      return res.status(400).json({ msg: "A note with this title already exists" });
    }

    const note = await Note.create({
      title,
      content: content || "",
      tags: tags || [],
      owner: req.user._id,
      sharedWith: [],
      references: [],
    });

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










exports.summarizeNote = async (req, res) => {
  try {
    const note = req.note;
    if (!note || !note.content) return res.status(400).json({ error: "No content" });

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: `Summarize this note:\n\n${note.content}` }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_KEY
        }
      }
    );

    // ✅ Extract summary properly
    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned";
    //console.log("Extracted Summary:", summary);

    res.json({ summary });
  } catch (err) {
    console.error("❌ Summarization error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to summarize note", details: err.message });
  }
};

exports.aiSearchAPI = async (req, res) => {
  try {
    const note = req.note;
    if (!note || !note.content) {
      return res.status(400).json({ error: "No content" });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          { parts: [{ text: `Query: ${req.body.query}\n\nNote Content:\n${note.content}` }] }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_KEY,
        }
      }
    );

    const summary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No Search returned";

    res.json({ results: [summary] }); // ✅ Always return array
  } catch (err) {
    console.error("❌ AI Search error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to run AI search", details: err.message });
  }
};

exports.questions = async (req, res) => {
  try {
    const note = req.note;
    if (!note || !note.content) return res.status(400).json({ error: "No content" });

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: `Give Questions based on this note:\n\n${note.content}` }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_KEY
        }
      }
    );

    // ✅ Extract QUestions properly
    const questions = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned";
    //console.log("Extracted Summary:", summary);

    res.json({ questions });
  } catch (err) {
    console.error("❌ Summarization error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to summarize note", details: err.message });
  }
};








exports.revokeAccess = async (req, res) => {
  try {
    const { userId } = req.body;
    const note = req.note; // ensured by middleware (owner-only)

    note.sharedWith = note.sharedWith.filter(
      (sw) => String(sw.userId) !== String(userId)
    );

    await note.save();
    res.json({ msg: "Access revoked", sharedWith: note.sharedWith });
  } catch (err) {
    res.status(500).json({ msg: "Revoke failed", error: err.message });
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

  // Supports [[Note Title#Heading]] and [[Note Title: Heading]]
const linkRegex = /\[\[([^\]#:]+)(?:[:#]([^\]]+))?\]\]/g;


  let match;
  const newRefs = [];

  while ((match = linkRegex.exec(content)) !== null) {
    const targetTitle = match[1].trim();     // e.g. "lmao"
    const toHeading = match[2]?.trim() || ""; // e.g. "heading1"

    console.log('Found link:', targetTitle, 'heading:', toHeading);

    if (targetTitle) {
      const targetNote = await findNoteByTitle(targetTitle);

      if (targetNote) {
        console.log('Found target note:', targetNote._id);

        // ⚡️ Allow cross-user linking if you want
        if (String(targetNote.owner) === String(userId)) {
          const exists = note.references.some(
            r => String(r.toNote) === String(targetNote._id) && r.toHeading === toHeading
          );

          if (!exists) {
            newRefs.push({
              fromHeading: "",     // optional: you could extract from current note’s heading later
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
    console.log(req.url, req.method);
    res.json(req.note); // set by access middleware
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    console.log(req.url, req.method);
    const { title, content, tags } = req.body;
    const note = req.note;

    // 🔒 Prevent renaming to a duplicate
    if (typeof title === "string" && title.trim() !== note.title.trim()) {
      const existing = await Note.findOne({
        owner: req.user._id,
        title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
        _id: { $ne: note._id } // exclude current note
      });
      if (existing) {
        return res.status(400).json({ msg: "A note with this title already exists" });
      }
      note.title = title;
    }

    if (typeof content === "string") {
  note.content = content;
  note.references = [];
  await parseAndAddReferences(note, req.user._id);
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
    console.log(req.url, req.method);
    await req.note.deleteOne();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};

exports.shareNote = async (req, res) => {
  try {
    console.log(req.url, req.method);
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
    console.log(req.url, req.method);
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
    console.log(req.url, req.method);
    const { toNoteId } = req.params;
    const note = req.note;

    note.references = note.references.filter(r => String(r.toNote) !== toNoteId);
    await note.save();
    res.json({ msg: "Reference removed", references: note.references });
  } catch (err) {
    res.status(500).json({ msg: "Remove reference failed", error: err.message });
  }
};



// Get all notes with sharedWith populated with username/email
exports.getNotesWithUsers = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("owner", "username email") // owner info
      .populate("sharedWith.userId", "username email") // sharedWith info
      .lean(); // plain JS objects

    // Map sharedWith to include username/email directly
    const enrichedNotes = notes.map(note => ({
      ...note,
      sharedWith: note.sharedWith.map(sw => ({
        userId: sw.userId._id,
        username: sw.userId.username,
        email: sw.userId.email,
        accessLevel: sw.accessLevel,
      })),
      ownerId: note.owner._id,
      ownerUsername: note.owner.username,
      ownerEmail: note.owner.email
    }));

    res.json(enrichedNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch notes", error: err.message });
  }
};
