  import { useState, useEffect } from "react";
  import axios from "axios";

  export default function ReferencePicker({ token, onInsert }) {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [headings, setHeadings] = useState([]);

    // Fetch all notes
    useEffect(() => {
      if (!token) return;
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNotes(res.data))
        .catch((err) => console.error("❌ Failed to fetch notes:", err));
    }, [token]);

    // Extract headings from markdown
    const extractHeadings = (content) => {
      if (!content) return [];
      const regex = /^(#{1,6})\s+(.*)$/gm;
      const matches = [];
      let match;
      while ((match = regex.exec(content))) {
        matches.push({ level: match[1].length, text: match[2] });
      }
      return matches;
    };

    const handleSelectNote = (noteId) => {
      const note = notes.find((n) => n._id === noteId);
      setSelectedNote(note);
      setHeadings(extractHeadings(note?.content));
    };

    const handleInsert = (heading) => {
      if (selectedNote && heading) {
        const reference = `[[${selectedNote.title}: ${heading.text}]]`;
        onInsert(reference);
      }
    };

    return (
      <div className="p-3 border rounded bg-gray-50 mt-2">
        <h3 className="font-semibold mb-2">Insert Reference</h3>

        <select
          onChange={(e) => handleSelectNote(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">-- Select Note --</option>
          {notes.map((n) => (
            <option key={n._id} value={n._id}>
              {n.title || "Untitled"}
            </option>
          ))}
        </select>

        {headings.length > 0 && (
          <select
            onChange={(e) => handleInsert(headings[e.target.value])}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Heading --</option>
            {headings.map((h, i) => (
              <option key={i} value={i}>
                {`${"#".repeat(h.level)} ${h.text}`}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
