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
    const questions = res.data;
    console.log(questions);


    // Ensure it always returns an array
    return (res.data.questions) ? [res.data.questions] : ["No questions returned"];
  } catch (err) {
    console.error("❌ Questions API failed:", err);
    return ["Failed to generate questions"];
  }
}

// Helpers for reference resolution
function extractSectionsFromMarkdown(content) {
  if (!content) return [];
  const lines = content.split("\n");
  const sections = [];
  let current = null;
  for (let line of lines) {
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      if (current) sections.push(current);
      current = { level: m[1].length, title: m[2], body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function normalizeStr(s) {
  return (s || "").trim().toLowerCase();
}

function renderWithReferencesMarkdown(markdown, allNotes, maxDepth = 5, depth = 0) {
  if (!markdown) return "";
  if (depth > maxDepth) return markdown;

  const replaced = markdown.replace(/\[\[(.+?):\s*(.+?)\]\]/g, (_, noteTitle, headingText) => {
    const t = normalizeStr(noteTitle);
    const h = normalizeStr(headingText);

    const refNote = allNotes.find(n => normalizeStr(n?.title) === t);
    if (!refNote) return `[[${noteTitle}: ${headingText}]]`;

    const sections = extractSectionsFromMarkdown(refNote.content || "");
    const target = sections.find(s => normalizeStr(s.title) === h);
    if (!target) return `[[${noteTitle}: ${headingText}]]`;

    const inner = target.body.join("\n");
    return `### ${refNote.title}: ${target.title}\n\n${inner}`;
  });

  return /\[\[(.+?):\s*(.+?)\]\]/.test(replaced)
    ? renderWithReferencesMarkdown(replaced, allNotes, maxDepth, depth + 1)
    : replaced;
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





export async function exportToPDFWithReferences(note, token, allNotes = null) {
  try {
    // 1) Ensure notes list available
    let notesList = Array.isArray(allNotes) ? allNotes : null;
    if (!notesList) {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notesList = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
    }

    // 2) Expand references
    const expanded = renderWithReferencesMarkdown(note?.content || "", notesList);

    // 3) Convert to HTML with minimal CSS for headings and code
    const safeTitle = (note?.title || "Untitled Note").replace(/[<>]/g, "");
const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        /* Base typography */
        body { font-family: Arial, sans-serif; font-size: 12pt; color: #111; line-height: 1.8; }
        p { margin: 12px 0; }

        /* Headings */
        h1 { font-size: 22pt; margin: 0 0 16px 0; line-height: 1.25; }
        h2 { font-size: 18pt; margin: 20px 0 12px; line-height: 1.3; }
        h3 { font-size: 16pt; margin: 18px 0 10px; line-height: 1.35; }
        h4 { font-size: 14pt; margin: 16px 0 10px; line-height: 1.4; }

        /* Lists */
        ul, ol { margin: 12px 0 12px 26px; }
        li { margin: 8px 0; line-height: 1.8; }

        /* Code & Pre */
        pre, code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          line-height: 1.7;
        }
        pre {
          background: #f6f8fa;
          padding: 14px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 14px 0;
        }

        /* Tables */
        table { border-collapse: collapse; width: 100%; margin: 14px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; line-height: 1.7; }
        thead th { background: #fafafa; }

        /* Blockquotes */
        blockquote {
          border-left: 4px solid #ddd;
          margin: 12px 0;
          padding: 10px 14px;
          color: #555;
          background: #fafafa;
          line-height: 1.7;
        }

        /* Horizontal rule */
        hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }

        /* Images */
        img { max-width: 100%; display: block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>${safeTitle}</h1>
      ${marked.parse(expanded || "No content")}
    </body>
  </html>
`;



    // 4) Render to PDF with jsPDF html plugin
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    await doc.html(html, {
      callback: (doc) => doc.save(`${note?.title || "note"}.pdf`),
      x: 40,
      y: 40,
      width: 515,      // A4 width (595pt) - 2*40pt margins
      windowWidth: 1024,
      autoPaging: "text",
    });
  } catch (err) {
    // Helpful console for debugging
    console.error("Export PDF failed:", err);
    throw err;
  }
}



// NotesEditingFunctionalities.jsx — enforce API only for saved notes on rename
export async function renameNote(note, newTitle, token) {
  if (!newTitle) throw new Error("New title is required");
  if (!note?._id) throw new Error("Do not call renameNote API for unsaved notes");
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/title`,
    { title: newTitle },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { ...note, ...res.data.note };
}

export function renameNoteLocal(note, newTitle) {
  if (!note || !newTitle) return note;
  return { ...note, title: newTitle }; // preserves content and other fields
}


// ✅ New helper: decide local vs API safely
export async function renameNoteSafe(note, newTitle, token) {
  if (!note?._id) return renameNoteLocal(note, newTitle);
  return await renameNote(note, newTitle, token);
}