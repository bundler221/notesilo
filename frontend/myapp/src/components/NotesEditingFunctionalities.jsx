// NotesEditingFunctionalities.jsx
import jsPDF from "jspdf";

// NotesEditingFunctionalities.jsx

// 🔹 Summarize with ChatGPT
export async function summarizeNoteWithAI(noteContent) {
  if (!noteContent) return "No content to summarize.";

  const res = await fetch("http://localhost:5000/api/notes/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: noteContent }),
  });

  const data = await res.json();
  return data.summary;
}

// 🔹 Prepare questions with ChatGPT
export async function prepareQuestionsWithAI(noteContent) {
  if (!noteContent) return ["No content found to prepare questions."];

  const res = await fetch("http://localhost:5000/api/notes/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: noteContent }),
  });

  const data = await res.json();
  return data.questions;
}


// Translate note content (mock version)
export function translateNote(noteContent, language = "hi") {
  if (!noteContent) return "No content to translate.";
  return `[${language.toUpperCase()} Translation] ${noteContent}`;
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
