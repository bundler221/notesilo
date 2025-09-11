// NotesEditingFunctionalities.jsx
import jsPDF from "jspdf";

import axios from "axios";

// ✅ Summarize Note via API
export async function summarizeNoteAPI(noteId, token) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/summarize`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.summary;
}

// ✅ Prepare Questions via API
export async function prepareQuestionsAPI(noteId, token) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/questions`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.questions;
}


// Export note to PDF
export function exportToPDF(noteTitle, noteContent) {
  const doc = new jsPDF();
  doc.text(noteTitle || "Untitled Note", 10, 10);
  doc.text(noteContent || "No content", 10, 20);
  doc.save(`${noteTitle || "note"}.pdf`);
}

// Rename note
export function renameNote(note, newTitle) {
  if (!note) return null;
  return { ...note, title: newTitle };
}
