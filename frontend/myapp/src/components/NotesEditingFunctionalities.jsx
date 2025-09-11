// NotesEditingFunctionalities.jsx
import jsPDF from "jspdf";
import { marked } from "marked";

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
// ✅ Prepare Questions via API
export async function prepareQuestionsAPI(noteId, token) {
  if (!noteId) return []; // safety check

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/questions`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data);


    // Ensure it always returns an array
    return (res.data.questions) ? [res.data.questions] : ["No questions returned"];
  } catch (err) {
    console.error("❌ Questions API failed:", err);
    return ["Failed to generate questions"];
  }
}
// ✅ AI Search API
export async function aiSearchAPI(noteId, query, token) {
  if (!query) return []; 

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/ai`,
      { query },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(res.data);

    return res.data.results
      ? Array.isArray(res.data.results)
        ? res.data.results
        : [res.data.results]
      : ["No results found"];
  } catch (err) {
    console.error("❌ AI Search API failed:", err);
    return ["Failed to fetch results"];
  }
}





// Export note to PDF
export function exportToPDF(noteTitle, noteContent) {
  const doc = new jsPDF();

  const htmlContent = `
    <h1>${noteTitle || "Untitled Note"}</h1>
    ${marked(noteContent || "No content")}
  `;

  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save(`${noteTitle || "note"}.pdf`);
    },
    x: 10,
    y: 10,
    width: 180,
    windowWidth: 800,
  });
}

// Rename note
export function renameNote(note, newTitle) {
  if (!note) return null;
  return { ...note, title: newTitle };
}
