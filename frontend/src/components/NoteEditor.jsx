import { useState, useEffect, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import axios from "axios";
import NoteActions from "./NoteActions";
import DraggableModal from "./DraggableModal";

export default function NoteEditor({ note, token, onSave, canEdit }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "");
  const [notes, setNotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState("");
  const lastNoteIdRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState("");


  const editorRef = useRef(null);
  const filteredCommands = commands.getCommands().filter(
    (cmd) => cmd.name !== "image"
  );

 const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });


useEffect(() => {
  if (!note) return;

  const incomingId = note._id || "__draft__";
  const switched = lastNoteIdRef.current !== incomingId;
  lastNoteIdRef.current = incomingId;

  const incomingTitle = note.title ?? "";
  const incomingContent = note.content ?? "";

  // Always sync both fields on note switch (new selection), even if empty
  if (switched) {
    setTitle(incomingTitle);
    setContent(incomingContent);
    return;
  }

  // Same note: update only if changed, and avoid clobbering edits with empty
  setTitle(prev => (prev !== incomingTitle ? incomingTitle : prev));
  setContent(prev => {
    if (incomingContent === "" && prev !== "") return prev;
    return prev !== incomingContent ? incomingContent : prev;
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [note?._id, note?.title, note?.content]);


useEffect(() => {
  if (!suggestions.length) return;

  const textarea = editorRef.current?.querySelector("textarea");
  if (!textarea) return;

  const { top, left, height } = getCursorCoordinates(textarea, cursorPos);
  setSuggestionPos({ top: top + height + 8, left: left + 12 });
}, [cursorPos, suggestions]);

function getCursorCoordinates(textarea, position) {
  const div = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  Array.from(style).forEach((key) => {
    div.style[key] = style[key];
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  const text = textarea.value.substring(0, position);
  div.textContent = text;

  const span = document.createElement("span");
  span.textContent = "\u200b"; // zero-width space for cursor
  div.appendChild(span);

  document.body.appendChild(div);
  const rect = span.getBoundingClientRect();
  document.body.removeChild(div);

  const containerRect = editorRef.current.getBoundingClientRect();
  return {
    top: rect.top - containerRect.top,
    left: rect.left - containerRect.left,
    height: rect.height || 16, // default line height fallback
  };
}

const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.url; // <- your Cloudinary URL from controller
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };





     
    const uploadImageCommand = {
    name: "upload-image",
    keyCommand: "upload-image",
    buttonProps: { "aria-label": "Upload image" },
    icon: (
  <span style={{ fontSize: 16 }}>🖼️</span>
),
    execute: async (state, api) => {
      // Open file picker
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const url = await handleImageUpload(file);
        if (!url) return;

        const markdownImage = `![alt text](${url})`;

        api.replaceSelection(markdownImage);
      };
    },
  };

  // Load note when prop changes
useEffect(() => {
  if (!note) return;
  const incomingTitle = note.title ?? "";
  const incomingContent = note.content ?? "";

  setTitle(prev => (prev !== incomingTitle ? incomingTitle : prev));

  setContent(prev => {
    // Avoid wiping text if incoming content is empty (common after title-only rename)
    if (incomingContent === "" && prev !== "") return prev;
    return prev !== incomingContent ? incomingContent : prev;
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [note?._id, note?.title, note?.content]);


  // Fetch all notes
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Extract headings from a note
  const extractHeadings = (note) => {
    if (!note?.content) return [];
    const regex = /^(#{1,6})\s+(.*)$/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(note.content))) {
      matches.push({ noteTitle: note.title, text: match[2] });
    }
    return matches;
  };

  // Handle editor changes & detect [[query
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

  // Insert selected reference
  const insertReference = (s) => {
    const refText = `[[${s.noteTitle}: ${s.text}]]`;

    const textarea = editorRef.current?.querySelector("textarea");
    if (!textarea) return;

    const before = content.slice(0, cursorPos);
    const start = before.lastIndexOf("[[");
    const newContent = content.slice(0, start) + refText + content.slice(cursorPos);

    setContent(newContent);
    setSuggestions([]);

    // Move cursor after inserted reference
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + refText.length;
    });
  };

  // Extract sections and render [[Note: Heading]] as accordion
  const extractSections = (content) => {
    if (!content) return [];
    const lines = content.split("\n");
    const sections = [];
    let current = null;
    for (let line of lines) {
      const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
      if (headingMatch) {
        if (current) sections.push(current);
        current = { level: headingMatch[1].length, title: headingMatch[2], body: [] };
      } else if (current) {
        current.body.push(line);
      }
    }
    if (current) sections.push(current);
    return sections;
  };

 const renderWithReferences = (text, depth = 0, maxDepth = 5) => {
  if (!text) return text;
  if (depth > maxDepth) return text; // 🔒 safety to prevent infinite loops

  let replaced = text.replace(/\[\[(.+?): (.+?)\]\]/g, (_, noteTitle, headingText) => {
    const refNote = notes.find((n) => n.title === noteTitle);
    if (!refNote) return `[[${noteTitle}: ${headingText}]]`;

    const sections = extractSections(refNote.content);
    const target = sections.find((s) => s.title.trim() === headingText.trim());
    if (!target) return `[[${noteTitle}: ${headingText}]]`;

    const innerMarkdown = target.body.join("\n");
    return `### ${noteTitle}: ${headingText}\n\n${innerMarkdown}`;
  });

  // 👇 Run recursively until no references remain
  if (/\[\[(.+?): (.+?)\]\]/.test(replaced)) {
    return renderWithReferences(replaced, depth + 1, maxDepth);
  }

  return replaced;
};




  const previewReferencesCommand = {
  name: "preview-references",
  keyCommand: "preview-references",
  buttonProps: { "aria-label": "Preview references" },
  icon: <span>📖</span>,
  execute: () => {
    const processed = renderWithReferences(content);
    setResults(processed);
    setShowResults(true);
  },
};

  return (
    <div className="p-2 bg-white rounded relative" ref={editorRef}>
      {/* {canEdit && (
        // <input
        //   type="text"
        //   value={title}
        //   onChange={(e) => setTitle(e.target.value)}
        //   className="border p-2 rounded w-full mb-2 text-xl font-bold"
        // />
      )} */}





<MDEditor
  value={content}
  onChange={(val) => handleEditorChange(val ?? "")}
  commands={[
    ...filteredCommands,
    uploadImageCommand,
    previewReferencesCommand, // new button
  ]}
  extraCommands={commands.getExtraCommands()}
  height={Math.max(400, Math.min(800, content.split("\n").length * 24))} // dynamic height
/>


<DraggableModal
  isOpen={showResults}
  onClose={() => setShowResults(false)}
  results={results}
  title="Preview"
/>

      {/* Floating Suggestion Box */}
{suggestions.length > 0 && (
  <ul
    className="absolute bg-white border rounded shadow p-2 max-h-40 overflow-y-auto z-10 w-80"
    style={{ top: suggestionPos.top, left: suggestionPos.left }}
  >
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



      {canEdit && (
        <NoteActions
          note={{ ...note, title, content }}
          token={token}
          canEdit={canEdit}
          onSave={onSave}
        />
      )}
    </div>
  );
}
