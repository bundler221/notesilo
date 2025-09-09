import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";

export default function NoteEditor({ note, token, onSave }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "## Example Heading");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "Untitled");
      setContent(note.content || "## Example Heading");
    }
  }, [note]);

  const handleSave = async () => {
    try {
      // Save to API if token exists
      if (token) {
        const url = note?._id
          ? `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`
          : `${import.meta.env.VITE_API_URL}/api/notes`;
        const method = note?._id ? "put" : "post";

        const res = await axios({
          method,
          url,
          headers: { Authorization: `Bearer ${token}` },
          data: { title, content },
        });
        console.log("✅ Note saved to API:", res.data);
        if (onSave) onSave(res.data);
      }

      // Download file
      const filename = `${title.replace(/\s+/g, "_") || "note"}.md`;
      const blob = new Blob([content], { type: "text/markdown" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);

      console.log(`💾 Saved Markdown as ${filename}`);
    } catch (err) {
      console.error("❌ Failed to save note:", err);
    }
  };

  return (
    <div className="p-2 border rounded bg-white text-black">
      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border w-full mb-2 p-2 rounded"
      />

      {/* Markdown Editor with built-in preview */}
      <MDEditor
        value={content}
        onChange={setContent}
        height={400}
        preview="live"   // 👈 this shows editor + preview in one
      />

      {/* Save button */}
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Save Note
      </button>
    </div>
  );
}
