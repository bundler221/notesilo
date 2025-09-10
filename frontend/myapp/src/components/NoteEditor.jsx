import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import NoteActions from "./NoteActions";


export default function NoteEditor({ note, token, onSave, canEdit }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "");
  const [notes, setNotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState("");

  // ✅ Load note when prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || "Untitled");
      setContent(note.content || "");
    }
  }, [note]);

  // ✅ Fetch all notes for reference search
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("❌ Failed to fetch notes:", err));
  }, [token]);

  // ✅ Extract all headings from a note
  const extractHeadings = (note) => {
    if (!note?.content) return [];
    const regex = /^(#{1,6})\s+(.*)$/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(note.content))) {
      matches.push({ noteId: note._id, noteTitle: note.title, text: match[2] });
    }
    return matches;
  };

  // ✅ Detect [[query while typing
  const handleEditorChange = (val) => {
    setContent(val);
    const match = val?.match(/\[\[([^\]]*)$/); // text after [[
    if (match) {
      const q = match[1].toLowerCase();
      setQuery(q);

      const allHeadings = notes.flatMap((n) => extractHeadings(n));
      const filtered = allHeadings.filter(
        (h) =>
          h.text.toLowerCase().includes(q) ||
          h.noteTitle.toLowerCase().includes(q)
      );
      setSuggestions(filtered.slice(0, 5)); // show top 5
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Insert selected reference
  const insertReference = (ref) => {
    const reference = `[[${ref.noteTitle}: ${ref.text}]]`;
    setContent((prev) => prev.replace(/\[\[[^\]]*$/, reference));
    setSuggestions([]);
  };




  // ✅ Render references in read-only mode as clickable links
  // ✅ Safe render for references
// eslint-disable-next-line no-unused-vars
const renderWithReferences = (text) => {
  if (typeof text !== "string") return text; // skip if not string

  const refRegex = /\[\[(.+?): (.+?)\]\]/g;
  return text.split(refRegex).map((part, idx, arr) => {
    if (idx % 3 === 1) {
      const noteTitle = arr[idx];
      const heading = arr[idx + 1];
      return (
        <a
          key={idx}
          href={`#${noteTitle}-${heading}`}
          className="text-blue-600 underline"
        >
          {noteTitle}: {heading}
        </a>
      );
    }
    if (idx % 3 === 2) return null;
    return <span key={idx}>{part}</span>;
  });
};


  return (
    <div className="p-2 border rounded bg-white text-black relative">
      {canEdit ? (
        <>
          {/* Editable mode */}
          <input
            className="border w-full mb-2 p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <MDEditor value={content} onChange={handleEditorChange} height={400} />

          {/* Suggestion Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border rounded shadow p-2 mt-1 max-h-40 overflow-y-auto z-10">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => insertReference(s)}
                  className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                >
                  <strong>{s.noteTitle}</strong> → {s.text}
                </li>
              ))}
            </ul>
          )}

          <NoteActions
  note={{ ...note, title, content }} // pass latest values
  token={token}
  canEdit={canEdit}
  onSave={onSave}
/>

        </>
      ) : (
        <>
          {/* Read-only mode */}
          <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
          <div className="prose max-w-none">
            <MDEditor.Markdown value={content} style={{ whiteSpace: "pre-wrap" }} />


          </div>
        </>
      )}
    </div>
  );
}
