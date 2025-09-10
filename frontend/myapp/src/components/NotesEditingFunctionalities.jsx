// NotesEditingFunctionalities.jsx
import jsPDF from "jspdf";

// Summarize the note content (mock summarization)
export function summarizeNote(noteContent) {
  if (!noteContent) return "No content to summarize.";
  return noteContent.split(".").slice(0, 2).join(".") + "...";
}

// Prepare questions from note content
export function prepareQuestions(noteContent) {
  if (!noteContent) return ["No content found to prepare questions."];
  return [
    "What is the main idea of this note?",
    "List 2 important points mentioned.",
    "How would you explain this concept in simple terms?",
  ];
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
