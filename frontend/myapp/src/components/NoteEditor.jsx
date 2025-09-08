import { useState, useEffect } from "react";
import axios from "axios";

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

      const method = note._id ? "put" : "post"; // PUT for existing, POST for new

      const res = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: { title, content },
      });

      console.log("✅ Note saved:", res.data);
      onSave(res.data); // update parent notes list
    } catch (err) {
      console.error("❌ Failed to save note:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        placeholder="Title"
        className="border w-full mb-2 p-2 rounded"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={content}
        placeholder="Content"
        className="border w-full h-64 p-2 rounded"
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 mt-2 text-white rounded"
      >
        Save Note
      </button>
    </div>
  );
}
