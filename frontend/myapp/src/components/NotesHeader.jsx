import { useState, useEffect } from "react";
import NoteSearch from "./NoteSearch";
import SharingLog from "./SharingLog";

export default function NotesHeader({
  username,
  notes,
  selectedNote,
  onSelectNote,
  onAddNote,
  onLogout,
  onNavigateGraph,
  onTogglePanel,   // ✅ added
  showNotesPanel,  // ✅ added
}) {
  const [sidebarOpen, setSidebarOpen] = useState(!selectedNote);
 

  useEffect(() => {
    if (!selectedNote) setSidebarOpen(true);
  }, [selectedNote]);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white border-b shadow-md">
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {sidebarOpen ? "×" : "☰"}
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, {username}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAddNote}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Note
          </button>

          <button
  onClick={onTogglePanel}
  className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
>
  {showNotesPanel ? "Hide Sharing" : "Manage"}
</button>

          <button
            onClick={onNavigateGraph}
            className="bg-green-50 text-green-700 border border-green-300 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-green-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Graph
          </button>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Notes Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-64px)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 flex flex-col h-full gap-3">
          <NoteSearch
            notes={notes}
            onSelectNote={(note) => {
              onSelectNote(note);
              setSidebarOpen(false);
            }}
          />

          <div className="flex-1 overflow-y-auto mt-3 flex flex-col gap-2">
            {notes.length === 0 ? (
              <p className="text-gray-500">No notes found</p>
            ) : (
              notes.map((note) => {
                const isActive = selectedNote === note;
                return (
                  <div
                    key={note._id || note.title}
                    onClick={() => {
                      onSelectNote(note);
                      setSidebarOpen(false);
                    }}
                    className={`p-3 border rounded-md cursor-pointer transition-colors duration-200
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-md"
                        : "hover:bg-green-50"
                    }`}
                  >
                    <h3 className="font-semibold">{note.title || "Untitled Note"}</h3>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>


    </>
  );
}
