import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import NoteActions from "./NoteActions";

// Custom extension to allow [[ typing without schema issues
import { Extension } from "@tiptap/core";

const ReferenceSuggestion = Extension.create({
  name: "referenceSuggestion",
  addProseMirrorPlugins() {
    return [];
  },
});

export default function NoteEdituh({ note, token, onSave, canEdit }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "");
  const [notes, setNotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [query, setQuery] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });

  const editorRef = useRef(null);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: {
          content: "block+",
        },
      }),
      ReferenceSuggestion,
    ],
    content: content,
    editable: canEdit,
    onUpdate: ({ editor }) => {
      const newContent = editor.getText();
      setContent(newContent);
      handleEditorChange(newContent, editor.state.selection.from);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] border p-2 rounded",
      },
    },
    autofocus: canEdit ? "start" : false,
  });

  // Update editor editable state when canEdit changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(canEdit);
      console.log("Editor editable state:", { canEdit, isEditable: editor.isEditable });
    }
  }, [canEdit, editor]);

  // Debug editor initialization
  useEffect(() => {
    if (editor) {
      console.log("Editor initialized:", { editable: editor.isEditable });
    } else {
      console.error("Editor failed to initialize");
    }
  }, [editor]);

  // Update suggestion position
  useEffect(() => {
    if (!suggestions.length || !editor) return;

    const { top, left, height } = getCursorCoordinates(editor, cursorPos);
    setSuggestionPos({ top: top + height + 5, left });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPos, suggestions, editor]);

  function getCursorCoordinates(editor, position) {
    const div = document.createElement("div");
    const editorEl = editorRef.current?.querySelector(".ProseMirror");
    if (!editorEl) return { top: 0, left: 0, height: 16 };

    const style = window.getComputedStyle(editorEl);

    Array.from(style).forEach((key) => {
      div.style[key] = style[key];
    });

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";

    const text = content.substring(0, position);
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
      height: rect.height || 16,
    };
  }

  // Load note when prop changes
  useEffect(() => {
    if (note && editor) {
      setTitle(note.title || "Untitled");
      setContent(note.content || "");
      editor.commands.setContent(note.content || "");
    }
  }, [note, editor]);

  // Fetch all notes
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Failed to fetch notes:", err));
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
  const handleEditorChange = (val = "", pos) => {
    setContent(val);
    setCursorPos(pos);

    const beforeCursor = val.slice(0, pos);
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
    if (!editor) return;

    const refText = `[[${s.noteTitle}: ${s.text}]]`;
    const before = content.slice(0, cursorPos);
    const start = before.lastIndexOf("[[");
    const newContent = content.slice(0, start) + refText + content.slice(cursorPos);

    setContent(newContent);
    setSuggestions([]);

    // Update editor content and move cursor
    editor.commands.setContent(newContent);
    editor.commands.setTextSelection(start + refText.length);
    editor.commands.focus();
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

  const renderWithReferences = (text) => {
    if (!text) return text;
    return text.replace(/\[\[(.+?): (.+?)\]\]/g, (_, noteTitle, headingText) => {
      const refNote = notes.find((n) => n.title === noteTitle);
      if (!refNote) return `[[${noteTitle}: ${headingText}]]`;

      const sections = extractSections(refNote.content);
      const target = sections.find((s) => s.title.trim() === headingText.trim());
      if (!target) return `[[${noteTitle}: ${headingText}]]`;

      const innerMarkdown = target.body.join("\n");
      return `
<details class="border rounded p-2 my-2">
  <summary class="cursor-pointer font-semibold text-blue-600">${noteTitle}: ${headingText}</summary>
  <div class="mt-2 prose">${innerMarkdown}</div>
</details>`;
    });
  };

  return (
    <div className="p-2 bg-white rounded relative" ref={editorRef}>
      {canEdit && (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2 text-xl font-bold"
        />
      )}

      <EditorContent editor={editor} />
      {canEdit && (
        <div
          dangerouslySetInnerHTML={{ __html: renderWithReferences(content) }}
          style={{ whiteSpace: "pre-wrap" }}
          className="mt-2 prose"
        />
      )}

      {/* Floating Suggestion Box */}
      {suggestions.length > 0 && canEdit && (
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