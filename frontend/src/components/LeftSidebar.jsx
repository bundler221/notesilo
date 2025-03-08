import React from "react";
import { FiChevronLeft } from "react-icons/fi";

export default function LeftSidebar({
  leftOpen,
  setLeftOpen,
  notes,
  selectedNote,
  setSelectedNote,
  handleAddNote,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div
      className={`sidebar fixed top-0 left-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out ${
        leftOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 z-50`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Notes</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddNote}
            className="add-note-btn px-2 py-1 text-sm bg-green-600 hover:bg-green-500 rounded transition"
          >
            + New
          </button>
          <button
            onClick={() => setLeftOpen(false)}
            className="leftham p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            <FiChevronLeft />
          </button>
        </div>
      </div>

      {/* === Search Bar === */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {/* === Notes List === */}
      <ul className="space-y-3 overflow-y-auto">
        {(searchQuery.trim()
          ? notes.filter((note) =>
              (note.title || "Untitled Note")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          : notes
        ).length === 0 ? (
          <p className="text-gray-400">No notes found</p>
        ) : (
          (searchQuery.trim()
            ? notes.filter((note) =>
                (note.title || "Untitled Note")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
            : notes
          ).map((note) => (
            <li
              key={note._id}
              onClick={() => {
                setSelectedNote(note);
                setLeftOpen(false);
              }}
              className={`p-2 rounded cursor-pointer transition ${
                selectedNote?._id === note._id
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              {note.title || "Untitled Note"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
