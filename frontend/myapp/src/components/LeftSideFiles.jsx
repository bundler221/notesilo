/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NoteEditor from "./NoteEditor";
import {
  FiMenu,
  FiChevronLeft,
  FiMoreVertical,
  FiUser,
  FiShare2,
  FiInfo,
  FiLogOut,
} from "react-icons/fi";
import {
  summarizeNoteWithAI,
  prepareQuestionsWithAI,
  translateNote,
  exportToPDF,
  renameNote,
} from "./NotesEditingFunctionalities";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("user");
  const [selectedNote, setSelectedNote] = useState(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const fileMenuRef = useRef(null);

  // === Get username from JWT or OAuth ===
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthUsername = params.get("username");
    if (oauthUsername) {
      localStorage.setItem("username", oauthUsername);
      setUsername(oauthUsername);
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "user");
      } catch (err) {
        console.error("Invalid token:", err);
        setUsername("user");
      }
    }
  }, [token]);

  // === Fetch Notes ===
  const fetchNotes = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setNotes(res.data);
      else if (res.data && typeof res.data === "object") setNotes([res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  // === Add New Note ===
  const handleAddNote = () => {
    setSelectedNote({ canWrite: true }); // empty new note
    setLeftOpen(false);
  };

  // === Save Note ===
  const handleNoteSave = (savedNote) => {
    if (!savedNote) {
      // Deleted
      setNotes((prev) => prev.filter((n) => n._id !== selectedNote._id));
      setSelectedNote(null);
      return;
    }

    setNotes((prev) => {
      const exists = prev.find((n) => n._id === savedNote._id);
      if (exists)
        return prev.map((n) =>
          n._id === savedNote._id ? savedNote : n
        );
      return [savedNote, ...prev];
    });
    setSelectedNote(savedNote);
  };

  // === Logout ===
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // === File Dropdown outside click close ===
  useEffect(() => {
    function handleClickOutside(event) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === File Actions ===
   const handleFileAction = async (action) => {
  if (!selectedNote) return;

   switch (action) {
    case "Summarize this note": {
      const summary = await summarizeNoteWithAI(selectedNote.content);
      alert(summary);
      break;
    }
    case "Prepare questions": {
      const questions = await prepareQuestionsWithAI(selectedNote.content);
      alert(questions.join("\n"));
      break;
    }
    case "Translate this note": {
      const translated = translateNote(selectedNote.content, "hi"); // Example Hindi
      alert(translated);
      break;
    }
    case "Export to PDF": {
      exportToPDF(selectedNote.title, selectedNote.content);
      break;
    }
    case "Rename": {
      const newTitle = prompt("Enter new title:", selectedNote.title);
      if (newTitle) {
        const updated = renameNote(selectedNote, newTitle);
        setSelectedNote(updated);
        setNotes((prev) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
      }
      break;
    }
    default:
      console.log("Unknown action:", action);
  }

  setFileMenuOpen(false);
};

  const currentFile = selectedNote?.title || "Untitled Note";

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* === NAVBAR === */}
      <div className="flex justify-between items-center bg-gray-100 p-3 shadow-md">
        {/* LEFT: menu + current file */}
        <div className="flex items-center space-x-3">
          <button
            onMouseEnter={() => setLeftOpen(true)}
            className="p-2 text-2xl bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            <FiMenu />
          </button>

          {/* Current File Dropdown */}
          <div className="relative" ref={fileMenuRef}>
            <button
              onClick={() => setFileMenuOpen((prev) => !prev)}
              className="font-medium text-gray-800 hover:underline"
            >
              {currentFile}
            </button>

            {fileMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <ul className="text-gray-800">
                  <li
                    onClick={() => handleFileAction("Summarize this note")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Summarize this note
                  </li>
                  <li
                    onClick={() => handleFileAction("Prepare questions")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Prepare questions
                  </li>
                  <li
                    onClick={() => handleFileAction("Translate this note")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Translate this note
                  </li>
                  <li
                    onClick={() => handleFileAction("Export to PDF")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Export to PDF
                  </li>
                   <li
                    onClick={() => handleFileAction("Rename")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Rename
                  </li>
                  
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CENTER */}
        <h1 className="text-xl font-bold text-gray-900">NoteSilo</h1>

        {/* RIGHT */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/graph")}
            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
          >
            <FiShare2 className="mr-1" /> Graph
          </button>

          <button
            onMouseEnter={() => setRightOpen(true)}
            className="p-2 text-2xl bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* === MAIN === */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out
            ${leftOpen ? "translate-x-0" : "-translate-x-full"} w-64 z-50`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Notes</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddNote}
                className="px-2 py-1 text-sm bg-green-600 hover:bg-green-500 rounded"
              >
                + New
              </button>
              <button
                onClick={() => setLeftOpen(false)}
                className="p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                <FiChevronLeft />
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {notes.length === 0 ? (
              <p>No notes found</p>
            ) : (
              notes.map((note) => (
                <li
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setLeftOpen(false);
                  }}
                  className={`p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer ${
                    selectedNote?._id === note._id ? "bg-gray-500" : ""
                  }`}
                >
                  {note.title || "Untitled Note"}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* EDITOR */}
        <section className="flex-1  overflow-y-auto">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              token={token}
              onSave={handleNoteSave}
              canEdit={selectedNote.canWrite}
            />
          ) : (
            <p className="text-gray-500">Select a note or add a new one</p>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <div
          className={`fixed top-0 right-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out
          ${rightOpen ? "translate-x-0" : "translate-x-full"} w-64 z-50`}
        >
          <div className="flex items-center justify-start mb-4 space-x-2">
            <button
              onClick={() => setRightOpen(false)}
              className="p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              <FiChevronLeft className="rotate-180" />
            </button>
            <h2 className="text-xl font-bold">Profile</h2>
          </div>

          <div className="flex flex-col items-center space-y-2 mb-6">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-3xl">
              <FiUser />
            </div>
            <p className="font-semibold">{username}</p>
          </div>

          <ul className="space-y-3">
            <li
              onClick={() => setRightOpen(false)}
              className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
            >
              <FiInfo className="mr-2" /> About Us
            </li>
          </ul>

          <div className="absolute bottom-6 left-0 w-full px-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full justify-center p-2 bg-red-600 hover:bg-red-500 rounded"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
