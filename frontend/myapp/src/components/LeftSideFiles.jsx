/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import DraggableModal from "./DraggableModal";
import { useNavigate, useLocation } from "react-router-dom";
import NoteEditor from "./NoteEditor";
import UserGuide from './UserGuide';
import Navbar from "./Navbar";
import { exportToPDFWithReferences } from "./NotesEditingFunctionalities";
import AboutUs from "./AboutUs";
import { renameNote ,renameNoteSafe,renameNoteLocal } from "./NotesEditingFunctionalities";

import RightSidebar from "./RightSidebar";
import SharingLog from "./SharingLog";
import LeftSidebar from "./LeftSidebar";
import NoteSearch from "./NoteSearch";

import {
  FiMenu,
  FiChevronLeft,
  FiMoreVertical,
  FiUser,
  FiShare2,
  FiTrendingUp,
  FiInfo,
  FiLogOut,
} from "react-icons/fi";
import {
  summarizeNoteAPI,
  prepareQuestionsAPI,
  aiSearchAPI
} from "./NotesEditingFunctionalities";

import Onboarding from "./Onboarding";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("user");
  const [selectedNote, setSelectedNote] = useState(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [showSharingLog, setShowSharingLog] = useState(false);
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [ques, setQues] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fileMenuRef = useRef(null);

  const toggleSharingLog = () => setShowSharingLog(prev => !prev);

  // === Handle noteId in URL ===
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const noteId = params.get("noteId");

    if (noteId && notes.length > 0) {
      const found = notes.find(n => n._id === noteId);
      if (found) {
        setSelectedNote(found);
        navigate("/dashboard", { replace: true });
      } else {
        (async () => {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/notes/${noteId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedNote(res.data);
            navigate("/dashboard", { replace: true });
          } catch (err) {
            console.error("Failed to fetch note:", err);
          }
        })();
      }
    }
  }, [location.search, notes, token, navigate]);

  // === Fetch username from JWT or OAuth ===
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
    setSelectedNote({ canWrite: true });
    setLeftOpen(false);
  };


  // Add a simple rename function
const handleRenameNote = (newTitle) => {
  if (!selectedNote) return;

  const updatedNote = { ...selectedNote, title: newTitle }; // preserve content and other fields
  setSelectedNote(updatedNote);

  setNotes((prev) =>
    prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
  );
};

  // === Save Note ===
  const handleNoteSave = (savedNote) => {
    if (!savedNote) {
      setNotes(prev => prev.filter(n => n._id !== selectedNote._id));
      setSelectedNote(null);
      return;
    }

    setNotes(prev => {
      const exists = prev.find(n => n._id === savedNote._id);
      if (exists) return prev.map(n => n._id === savedNote._id ? savedNote : n);
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

  // === AI Search ===
  const handleSearch = async () => {
    if (!query) return;
    if (!selectedNote?._id) return alert("⚠️ Please select a note first");

    setLoading(true);
    const data = await aiSearchAPI(selectedNote._id, query, token);
    setModalContent(data);
    setModalTitle("Search Results");
    setShowModal(true);
    setLoading(false);
  };

  // === File Actions ===
  // === File Actions ===
const handleFileAction = async (action) => {
  if (!selectedNote) return;

  switch (action) {

    case "Summarize this note":
  setIsSummarizing(true);
  try {
    const summary = await summarizeNoteAPI(selectedNote._id, token);
    setModalTitle("Summary of this note");
    setModalContent(summary);
    setFileMenuOpen(false);          // close menu first
    setShowModal(true);              // then open modal
  } finally {
    setIsSummarizing(false);
  }
  break;

case "Prepare questions":
  setIsPreparing(true);
  try {
    const questions = await prepareQuestionsAPI(selectedNote._id, token);
    setModalTitle("Prepared Questions");
    setModalContent(questions);
    setFileMenuOpen(false);          // close menu first
    setShowModal(true);              // then open modal
  } finally {
    setIsPreparing(false);
  }
  break;


    case "Translate this note": {
      // eslint-disable-next-line no-undef
      const translated = await translateNote(selectedNote.content, "hi");
      setModalContent(translated);    // ✅ show translated note
      setShowModal(true);
      setFileMenuOpen(false);
      break;
    }

    case "Export to PDF": {
  await exportToPDFWithReferences(selectedNote, token, notes);
  setFileMenuOpen(false);
  break;
}

case "Rename": {
  const newTitle = prompt("Enter new title:", selectedNote.title);
  if (!newTitle) break;

  if (selectedNote._id) {
    // Saved note → PATCH, then merge back current content
    const updated = await renameNote(selectedNote, newTitle, token);
    const merged = { ...updated, content: selectedNote.content ?? updated.content ?? "" };
    setSelectedNote(merged);
    setNotes(prev => prev.map(n => (n._id === merged._id ? merged : n)));
  } else {
    // Draft → local-only rename (do NOT call API)
    const updated = renameNoteLocal(selectedNote, newTitle);
    setSelectedNote(updated);
    setNotes(prev => prev.map(n => (n === selectedNote ? updated : n)));
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
      <Onboarding />

      {/* === NAVBAR === */}
      <Navbar
        notes={notes}
        setNotes={setNotes} 
        setSelectedNote={setSelectedNote}
        leftOpen={leftOpen}
        setLeftOpen={setLeftOpen}
        rightOpen={rightOpen}
        setRightOpen={setRightOpen}
        username={username}
        selectedNote={selectedNote}
        query={query}
        setQuery={setQuery}
        token={token}
        handleSearch={handleSearch}
        handleFileAction={handleFileAction}
        isSearching={isSearching}
        isSummarizing={isSummarizing}
        isPreparing={isPreparing}
      />

      {/* === MAIN === */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <LeftSidebar
          leftOpen={leftOpen}
          setLeftOpen={setLeftOpen}
          notes={notes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          handleAddNote={handleAddNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* EDITOR */}
        <section className="flex-1 overflow-y-auto bg-gray-50">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              token={token}
              onSave={handleNoteSave}
              canEdit={selectedNote.canWrite}
            />
          ) : (
            <div className="text-center mt-8">
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
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <RightSidebar
          rightOpen={rightOpen}
          setRightOpen={setRightOpen}
          username={username}
          showSharingLog={showSharingLog}
          toggleSharingLog={toggleSharingLog}
          handleLogout={handleLogout}
          token={token}
        />
        <DraggableModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  results={modalContent}
  title={modalTitle}
/>
      </div>
    </div>
  );
}
