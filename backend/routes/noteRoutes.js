const express = require("express");
const {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  addReference,
  removeReference,
  revokeAccess,
  getNotesWithUsers,
  summarizeNote,
  questions,
  aiSearchAPI,
  updateNoteTitle
} = require("../controllers/noteController");
const { protect } = require("../middlewares/authMiddleware");
const { requireNoteAccess } = require("../middlewares/accessMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/", getMyNotes);

router.get("/:id", requireNoteAccess("read"), getNoteById);
router.put("/:id", requireNoteAccess("write"), updateNote);
router.delete("/:id", requireNoteAccess("owner"), deleteNote);
router.post("/:id/share", requireNoteAccess("owner"), shareNote);
router.post("/:id/revoke", requireNoteAccess("owner"), revokeAccess);
router.post("/:id/references", requireNoteAccess("write"), addReference);
router.delete("/:id/references/:toNoteId", requireNoteAccess("write"), removeReference);
router.patch("/:id/title", requireNoteAccess("write"), updateNoteTitle);

// ✅ Summarize note
router.post("/:id/summarize", requireNoteAccess("read"), summarizeNote);
router.post("/:id/questions", requireNoteAccess("read"), questions);
router.post("/:id/ai", requireNoteAccess("read"), aiSearchAPI);
router.get("/enriched", getNotesWithUsers);

module.exports = router;
