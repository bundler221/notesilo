const express = require("express");
const {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  addReference,
  removeReference
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

router.post("/:id/references", requireNoteAccess("write"), addReference);
router.delete("/:id/references/:toNoteId", requireNoteAccess("write"), removeReference);

module.exports = router;
