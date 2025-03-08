  import React, { useState, useRef, useEffect } from "react";
  import { FiMenu, FiMoreVertical, FiTrendingUp, FiEdit } from "react-icons/fi";
  import { useNavigate } from "react-router-dom";
  import RenameModal from "./RenameModal";
  import { renameNote } from "./NotesEditingFunctionalities";


  export default function Navbar({
    notes,
    setNotes,
    selectedNote,
    token,
    setSelectedNote,
    leftOpen,
    setLeftOpen,
    rightOpen,
    setRightOpen,
    username,
    query,
    setQuery,
    handleSearch,
    handleFileAction,
    isSearching,
    isSummarizing,
    isPreparing,
  }) {
    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const fileMenuRef = useRef(null);
    const titleInputRef = useRef(null);
    const navigate = useNavigate();

    const currentFile = selectedNote?.title || "Untitled Note";

    // Close file menu on outside click
    useEffect(() => {
      function handleClickOutside(event) {
        if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
          setFileMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


const saveTitle = async () => {
  const raw = selectedNote?.title ?? "";
  const normalized = raw.trim() || "Untitled";

  // Draft: local-only rename; do not POST
  if (!selectedNote?._id) {
    setSelectedNote(prev => ({ ...prev, title: normalized }));
    setEditingTitle(false);
    setFileMenuOpen(false);
    return;
  }

  // Saved: PATCH and preserve current in-memory content
  try {
    const updated = await renameNote(selectedNote, normalized, token);
    setSelectedNote(prev => ({
      ...(updated || prev),
      content: prev?.content ?? updated?.content ?? "",
    }));
    setNotes(prev =>
      prev.map(n => (n._id === updated._id ? { ...updated, content: n.content } : n))
    );
  } catch (e) {
    alert(e.message);
  } finally {
    setEditingTitle(false);
    setFileMenuOpen(false);
  }
};





    const handleKeyDown = (e) => {
      if (e.key === "Enter") saveTitle();
    };

    return (
      <div className="bg-white p-3 shadow-md relative z-10">
        <div className="max-w-full mx-auto relative flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => setLeftOpen(true)}
              className="hamburger-btn p-2 text-2xl bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <FiMenu />
            </button>

            <div className="relative flex items-center">
{!editingTitle ? (
  <>
    <button
      onClick={() => setFileMenuOpen(prev => !prev)}
      className="font-bold text-gray-800 hover:underline cursor-pointer truncate max-w-[160px] sm:max-w-[220px] text-left"
      title={selectedNote?.title || "Untitled Note"}
    >
      {selectedNote?.title || "Untitled Note"}
    </button>
    <FiEdit
      onClick={() => setEditingTitle(true)}
      className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
    />
  </>
) : (
  <div className="flex items-center space-x-2">
    <input
  type="text"
  value={selectedNote?.title ?? ""}    // allow empty while editing
  placeholder="Untitled Note"
  onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
  onKeyDown={async (e) => { if (e.key === "Enter") await saveTitle(); }}
  autoFocus
  className="border px-2 py-1 rounded w-40 sm:w-60"
/>
    <button
      onClick={saveTitle}
      className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 transition"
    >
      Save
    </button>
  </div>
)}



              {/* Dropdown menu BELOW the title/input */}
              {fileMenuOpen && (
                <div
                  ref={fileMenuRef}
                  className="absolute left-0 top-full mt-2 w-56 bg-gray-800 text-white border border-gray-300 rounded-md shadow-lg z-50"
                >
                  <ul>
                    {["Summarize this note", "Prepare questions", "Export to PDF", "Rename"].map(action => (
                      <li
                        key={action}
                        onClick={() => handleFileAction(action)}
                        className="px-4 py-2 hover:bg-gray-700 rounded cursor-pointer"
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Inline Search (lg only) */}
            {!editingTitle && (
              <div className="hidden lg:flex items-center ml-4 space-x-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="px-3 py-2 border rounded w-64"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>
            )}
          </div>

          {/* CENTER */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700 bg-clip-text text-transparent animate-pulse">
                NoteSilo
              </span>
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => navigate("/graph")}
              className="flex border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out"
            >
              <FiTrendingUp className="mr-1" /> Map
            </button>

            <button
              onClick={() => setRightOpen(true)}
              className="right-btn p-2 text-2xl bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <FiMoreVertical />
            </button>
          </div>

        </div>

        {/* Small screen search */}
        <div className="mt-3 lg:hidden">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-black-600 text-white rounded hover:bg-black-500"
            >
              Search
            </button>
          </div>
        </div>

        
      </div>
    );
  }
