import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";

export default function NoteEditor({ note, token, onSave, canEdit }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [content, setContent] = useState(note?.content || "## Example Heading");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "Untitled");
      setContent(note.content || "## Example Heading");
    }
  }, [note]);

  const handleSave = async () => {
    if (!canEdit) return; // ✅ prevent saving if not allowed
    try {
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
        if (onSave) onSave(res.data);
      }
    } catch (err) {
      console.error("❌ Failed to save note:", err);
    }
  };

  return (
    <div className="p-2 border rounded bg-white text-black">
      {canEdit ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border w-full mb-2 p-2 rounded"
          />
          <MDEditor value={content} onChange={setContent} height={400} preview="live" />
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Save Note
          </button>
        </>
      ) : (
        <>
  <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
  <MDEditor.Markdown source={content} style={{ whiteSpace: "pre-wrap" }} />
</>

      )}
    </div>
  );
}
