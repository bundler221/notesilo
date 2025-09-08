import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteEditor({ note, token, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  const handleSave = async () => {
    try {
      const url = note._id
        ? `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`
        : `${import.meta.env.VITE_API_URL}/api/notes`;

      const method = note._id ? "put" : "post";

      const res = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: { title, content },
      });

      console.log("✅ Note saved:", res.data);
      onSave(res.data);
    } catch (err) {
      console.error("❌ Failed to save note:", err);
    }
  };

  // Insert Markdown shortcut at cursor position
  const insertAtCursor = (shortcut) => {
    const textarea = document.getElementById("editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);

    const newContent = before + shortcut + after;
    setContent(newContent);

    // Restore cursor inside the inserted shortcut
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + shortcut.length;
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <input
        type="text"
        value={title}
        placeholder="Title"
        className="border w-full mb-2 p-2 rounded"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => insertAtCursor("**bold**")}
        >
          B
        </button>
        <button
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => insertAtCursor("*italic*")}
        >
          I
        </button>
        <button
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => insertAtCursor("# Heading ")}
        >
          H1
        </button>
        <button
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => insertAtCursor("- ")}
        >
          • List
        </button>
        <button
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => insertAtCursor("```js\ncode\n```")}
        >
          {"</>"}
        </button>
      </div>

      {/* Editor + Preview Split */}
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <textarea
          id="editor"
          value={content}
          placeholder="Write in Markdown..."
          className="border w-full h-full p-2 rounded font-mono resize-none"
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="border rounded p-2 overflow-auto bg-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || "*Live preview...*"}
          </ReactMarkdown>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 mt-2 text-white rounded"
      >
        Save Note
      </button>
    </div>
  );
}
