import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import NoteActions from "./NoteActions";

export default function NoteEdituh({ note, token, onSave, canEdit }) {
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
    const match = val?.match(/\[\[([^\]]*)$/);
    if (match) {
      const q = match[1].toLowerCase();
      setQuery(q);

      const allHeadings = notes.flatMap((n) => extractHeadings(n));
      const filtered = allHeadings.filter(
        (h) =>
          h.text.toLowerCase().includes(q) ||
          h.noteTitle.toLowerCase().includes(q)
      );
      setSuggestions(filtered.slice(0, 5));
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

          {/* 🚀 Obsidian-like live editor */}
          <ObsidianEditor value={content} onChange={handleEditorChange} />

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
            note={{ ...note, title, content }}
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
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------- 📝 Inline Markdown Editor ----------------- */
function ObsidianEditor({ value, onChange }) {
  const lines = value.split("\n");

  const updateLine = (index, newValue) => {
    const newLines = [...lines];
    newLines[index] = newValue;
    onChange(newLines.join("\n"));
  };

  return (
    <div className="p-2 bg-white text-black rounded">
      {lines.map((line, idx) => (
        <LineBlock
          key={idx}
          value={line}
          onChange={(v) => updateLine(idx, v)}
        />
      ))}
    </div>
  );
}

function LineBlock({ value, onChange }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={1}
        className="w-full resize-none bg-transparent focus:outline-none font-mono transition-all"
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="cursor-text hover:bg-gray-50 rounded px-1 transition-colors"
    >
      <ReactMarkdown>{value || " "}</ReactMarkdown>
    </div>
  );
}
