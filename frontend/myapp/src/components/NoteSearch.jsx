import { useState, useEffect } from "react";

export default function NoteSearch({ notes, onSelectNote, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = notes.filter((note) =>
      (note.title || "Untitled Note")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, notes]);

  const handleSelect = (note) => {
    onSelectNote(note);   // select note
    setSearchTerm("");    // clear search
    setSearchResults([]); // hide dropdown
    if (onClose) onClose(); // ✅ close sidebar if passed
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded border w-full focus:ring-2 focus:ring-[#00cc44] focus:border-[#00cc44] outline-none"
      />

      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {searchResults.map((note) => (
            <div
              key={note._id || note.title}
              onClick={() => handleSelect(note)}
              className="p-2 cursor-pointer hover:bg-[#ccffdd] transition-colors duration-200"
            >
              {note.title || "Untitled Note"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
