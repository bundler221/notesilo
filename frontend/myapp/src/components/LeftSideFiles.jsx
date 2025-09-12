/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import DraggableModal from "./DraggableModal";
import { Link, useNavigate } from "react-router-dom";
import NoteEditor from "./NoteEditor";
import UserGuide from './UserGuide'
import AboutUs from "./AboutUs";
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
  summarizeNoteAPI,
  prepareQuestionsAPI,
  exportToPDF,
  renameNote,
  aiSearchAPI
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const [ques, setQues] = useState([])
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  // const [query, setQuery] = useState("");
  // const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);



  const searchNotes = async (query) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notes/search?q=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data);
    } catch (err) {
      console.error("❌ Search failed:", err);
    }
  };

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


  const handleSearch = async () => {
    if (!query) return;

    if (!selectedNote?._id) {
      alert("⚠️ Please select a note first");
      return;
    }

    setLoading(true);
    const data = await aiSearchAPI(selectedNote._id, query, token); // ✅ pass noteId
    // setResults(data);
    setModalContent(data);
    setModalTitle("Search Results");
    setShowModal(true);      // open modal
    setLoading(false);
  };

  // === File Actions ===
  const handleFileAction = async (action) => {
    if (!selectedNote) return;

    switch (action) {
      case "Summarize this note":
        setIsSummarizing(true);
        try {
          const summary = await summarizeNoteAPI(selectedNote._id, token);
          setModalContent(summary);     // ✅ show summary in modal
          setModalTitle("Summary of this note");

          setShowModal(true);
        } finally {
          setIsSummarizing(false);
          setFileMenuOpen(false);
        }
        break;

      case "Prepare questions":
        setIsPreparing(true);
        try {
          const questions = await prepareQuestionsAPI(selectedNote._id, token);
          setQues(questions);
          setModalContent(questions);   // ✅ show questions in modal
          setModalTitle("Prepared Questions");

          setShowModal(true);
        } finally {
          setIsPreparing(false);
          setFileMenuOpen(false);
        }
        break;

      case "Translate this note": {
        const translated = await translateNote(selectedNote.content, "hi");
        setModalContent(translated);    // ✅ show translated note
        setShowModal(true);
        setFileMenuOpen(false);
        break;
      }

      case "Export to PDF": {
        exportToPDF(selectedNote.title, selectedNote.content);
        setFileMenuOpen(false);
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
        setFileMenuOpen(false);
        break;
      }

      default:
        console.log("Unknown action:", action);
    }
  };


  const currentFile = selectedNote?.title || "Untitled Note";
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* === NAVBAR === */}
      <div className="bg-white p-3 shadow-md relative z-10">
        <div className="max-w-full mx-auto relative">
          {/* ROW 1: left (hamburger + note name + inline-lg-search), center(title - lg only), right (graph + 3dots) */}
          <div className="flex items-center justify-between">
            {/* LEFT group */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Hamburger */}
              <button
                onClick={() => setLeftOpen(true)}
                className="p-2 text-2xl bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <FiMenu />
              </button>

              {/* Current File */}
              <div className="relative">
                <button
                  onClick={() => setFileMenuOpen((prev) => !prev)}
                  className="font-bold text-gray-800 hover:underline cursor-pointer truncate max-w-[160px] sm:max-w-[220px] text-left"
                  title={currentFile}
                >
                  {currentFile}
                </button>

                {fileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-gray-800 text-white border border-gray-300 rounded-md shadow-lg z-50">
                    <ul className="">
                      {[
                        "Summarize this note",
                        "Prepare questions",
                        "Translate this note",
                        "Export to PDF",
                        "Rename",
                      ].map((action) => {
                        let displayText = action;

                        if (action === "Summarize this note" && isSummarizing) displayText = "Summarizing...";
                        if (action === "Prepare questions" && isPreparing) displayText = "Preparing questions...";

                        return (
                          <li
                            key={action}
                            onClick={() => handleFileAction(action)}
                            className={`px-4 py-2 hover:bg-gray-700 rounded cursor-pointer ${(isSummarizing && action === "Summarize this note") ||
                              (isPreparing && action === "Prepare questions")
                              ? "text-gray-400 pointer-events-none"
                              : ""
                              }`}
                          >
                            {displayText}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Inline SEARCH visible on large screens (keeps search next to notes name on lg) */}
              <div className="hidden lg:flex items-center ml-4 space-x-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="px-3 py-2 border rounded w-64"
                />
                <button
                  onClick={async () => {
                    setIsSearching(true);
                    await handleSearch();   // your existing search function
                    setIsSearching(false);
                  }}
                  disabled={isSearching}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>

              </div>
            </div>

            {/* CENTER: project name — absolutely centered on large screens to avoid layout shifting */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
              <h1 className="text-3xl font-bold text-gray-900"><span className=" text-yellow-600">N</span>oteSilo</h1>
            </div>

            {/* RIGHT group */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => navigate("/graph")}
                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition text-sm sm:text-base"
              >
                <FiShare2 className="mr-1" /> Graph
              </button>

              <button
                onClick={() => setRightOpen(true)}
                className="p-2 text-2xl bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <FiMoreVertical />
              </button>
            </div>
          </div>

          {/* ROW 2: Search row for small & medium screens (visible only below lg) */}
          <div className="mt-3 lg:hidden">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Search
              </button>
            </div>
          </div>

          {/* Search results modal (single instance) */}
          <DraggableModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            results={modalContent || results}   // ✅ modal shows whatever you set
            title={modalTitle}

          />
        </div>
      </div>

      {/* === MAIN === */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out ${leftOpen ? "translate-x-0" : "-translate-x-full"
            } w-64 z-50`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Notes</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddNote}
                className="px-2 py-1 text-sm bg-green-600 hover:bg-green-500 rounded transition"
              >
                + New
              </button>
              <button
                onClick={() => setLeftOpen(false)}
                className="p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md transition"
              >
                <FiChevronLeft />
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-gray-400">No notes found</p>
            ) : (
              notes.map((note) => (
                <li
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setLeftOpen(false);
                  }}
                  className={`p-2 rounded cursor-pointer transition ${selectedNote?._id === note._id ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                >
                  {note.title || "Untitled Note"}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* EDITOR */}
        <section className="flex-1 overflow-y-auto bg-gray-50">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              token={token}
              onSave={handleNoteSave}
              canEdit={selectedNote.canWrite}
            />
          ) : (<>
            <div className="text-center  mt-8">
              <h2 className="text-gray-500 text-lg md:text-xl font-medium">
                Select a note or add a new one
              </h2>

              <p className="text-gray-400 mt-2 text-sm md:text-base">
                💡 Tip: Click{" "}
                <button
                  onClick={handleAddNote}
                  className="px-2 py-1 text-sm bg-green-600 hover:bg-green-500 rounded transition text-white cursor-pointer"
                >
                  + New
                </button>{" "}
                to create your first note and start writing!
              </p>

              <div className="mt-4 text-gray-400 text-sm md:text-base space-y-1">
                <p> Use <span className="font-mono">#</span> for <span className="font-semibold">Heading 1</span></p>
                <p> Use <span className="font-mono">##</span> for <span className="font-semibold">Heading 2</span></p>
                <p> Use <span className="font-mono">-</span> or <span className="font-mono">*</span> for bullet points</p>
                <p>✨ You can also style text with <span className="font-mono">**bold**</span> or <span className="font-mono">*italic*</span></p>
              </div>
            </div>

          </>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <div
          className={`fixed top-0 right-0 h-full bg-gray-900 text-white p-4 transition-transform duration-300 ease-in-out ${rightOpen ? "translate-x-0" : "translate-x-full"
            } w-64 z-50`}
        >
          <div className="flex items-center justify-start mb-4 space-x-2">
            <button
              onClick={() => setRightOpen(false)}
              className="p-1 text-2xl bg-gray-700 hover:bg-gray-600 rounded-md transition"
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
              className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
            >
              <FiInfo className="mr-2" />
              <Link to="/user-guide" className="text-gray-100 hover:underline">
                User Guide
              </Link>
            </li>

            <li
              onClick={() => setRightOpen(false)}
              className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
            >
              <FiInfo className="mr-2" />
              <Link to="/about-us" className="text-gray-100 hover:underline">
                About Us
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-6 left-0 w-full px-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full justify-center p-2 bg-red-600 hover:bg-red-500 rounded transition"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}
