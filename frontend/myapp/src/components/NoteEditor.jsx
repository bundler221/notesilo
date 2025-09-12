import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import NoteActions from "./NoteActions";

export default function NoteEditor({ note, token, onSave, canEdit }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "");
  const [notes, setNotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [, setQuery] = useState("");
  const editorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(0);

  // ✅ Auto-resize textarea
  useEffect(() => {
    const textarea = editorRef.current?.querySelector("textarea");
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [content]);

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

  // ✅ Detect [[query near cursor
  const handleEditorChange = (val = "") => {
    setContent(val);

    const textarea = editorRef.current?.querySelector("textarea");
    if (!textarea) return;

    setCursorPos(textarea.selectionStart);

    const beforeCursor = val.slice(0, textarea.selectionStart);
    const match = beforeCursor.match(/\[\[([^\]]*)$/);

    if (match) {
      const q = match[1].trim().toLowerCase();
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
  const insertReference = (s) => {
    const refText = `[[${s.noteTitle}: ${s.text}]]`;

    const before = content.slice(0, cursorPos);
    const match = before.match(/\[\[([^\]]*)$/);

    if (match) {
      const start = before.lastIndexOf("[[");
      const newContent =
        content.slice(0, start) + refText + content.slice(cursorPos);

      setContent(newContent);
      setSuggestions([]);

      setCursorPos(start + refText.length);
    }
  };

  // ✅ Render references in read-only mode
  const renderWithReferences = (text) => {
    if (typeof text !== "string") return text;
    const refRegex = /\[\[(.+?): (.+?)\]\]/g;

    return text.replace(refRegex, (match, noteTitle, heading) => {
      return `<a href="#${noteTitle}-${heading}" class="text-blue-600 underline">${noteTitle}: ${heading}</a>`;
    });
  };

  return (
    <div className="p-2 rounded bg-white text-black relative" ref={editorRef}>
      {canEdit ? (
        <>
          {/* ✅ Editable Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold mb-3 border-b border-gray-300 outline-none focus:border-blue-500"
          />

          <MDEditor
            value={content}
            onChange={handleEditorChange}
            height={400}
          />

          {/* Floating Suggestion Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute left-4 bottom-20 bg-white border rounded shadow p-2 max-h-40 overflow-y-auto z-10 w-80">
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
          <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
          <div className="prose max-w-none">
            <MDEditor.Markdown
              source={renderWithReferences(content)}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
