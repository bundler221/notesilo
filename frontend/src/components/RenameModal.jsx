import React, { useState } from "react";
import { renameNote as renameNoteAPI } from "./NotesEditingFunctionalities";

export default function RenameModal({ isOpen, currentTitle, note, setSelectedNote, setNotes, onClose }) {
  const [newTitle, setNewTitle] = useState(currentTitle || "");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!note) return;

    try {
      let updatedNote;

      // New note without _id -> create first
      if (!note._id) {
        updatedNote = await renameNoteAPI(null, newTitle); // your API should handle creating if no _id
      } else {
        updatedNote = await renameNoteAPI(note._id, newTitle);
      }

      setSelectedNote(updatedNote);
      setNotes(prev => {
        const exists = prev.find(n => n._id === updatedNote._id);
        if (exists) return prev.map(n => n._id === updatedNote._id ? updatedNote : n);
        return [updatedNote, ...prev];
      });
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename note");
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-3">Rename Note</h2>
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          onKeyDown={e => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
