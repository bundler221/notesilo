import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import NoteArea from "./NoteArea";
import FileMenu from "./FileMenu";
import ModalsManager from "./ModalsManager";

const Dashboard = ({ token, handleLogout }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [username, setUsername] = useState("User");

  // Sidebar states
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  // Search states
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // File menu states
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);

  // Sharing log toggle
  const [showSharingLog, setShowSharingLog] = useState(false);

  // Fetch notes + user info on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API calls (replace with your actual ones)
        const notesRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notesData = await notesRes.json();
        setNotes(notesData);

        const userRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUsername(userData.username || "User");
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };
    fetchData();
  }, [token]);

  // Add a new note
  const handleAddNote = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "Untitled", content: "" }),
      });
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Save note
  const handleNoteSave = async (note) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, ...note } : n))
      );
      setSelectedNote(note);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // File menu actions
  const handleFileAction = async (action) => {
    if (!selectedNote) return;
    setFileMenuOpen(false);

    switch (action) {
      case "summarize":
        setIsSummarizing(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes/${selectedNote._id}/summarize`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setModalTitle("Summary");
          setModalContent(data.summary);
          setShowModal(true);
        } catch (err) {
          console.error("Error summarizing:", err);
        }
        setIsSummarizing(false);
        break;

      case "prepareQuestions":
        setIsPreparing(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes/${selectedNote._id}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setModalTitle("Prepared Questions");
          setModalContent(data.questions);
          setShowModal(true);
        } catch (err) {
          console.error("Error preparing questions:", err);
        }
        setIsPreparing(false);
        break;

      case "exportPDF":
        window.open(`${import.meta.env.VITE_API_URL || ""}/api/notes/${selectedNote._id}/export?token=${token}`);
        break;

      case "rename":
        setShowRenameModal(true);
        break;

      default:
        break;
    }
  };

  // Search notes
  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setModalTitle("Search Results");
      setModalContent(data.results);
      setShowModal(true);
    } catch (err) {
      console.error("Search error:", err);
    }
    setIsSearching(false);
  };

  // Toggle sharing log
  const toggleSharingLog = () => setShowSharingLog((prev) => !prev);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        currentFile={selectedNote?.title}
        setFileMenuOpen={setFileMenuOpen}
        fileMenuOpen={fileMenuOpen}
        onFileAction={handleFileAction}
        isSummarizing={isSummarizing}
        isPreparing={isPreparing}
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        setLeftOpen={setLeftOpen}
        setRightOpen={setRightOpen}
      />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <LeftSidebar
          notes={notes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          searchQuery={query}
          setSearchQuery={setQuery}
          handleAddNote={handleAddNote}
          leftOpen={leftOpen}
          setLeftOpen={setLeftOpen}
        />

        {/* Note Area */}
        <NoteArea
          selectedNote={selectedNote}
          token={token}
          handleNoteSave={handleNoteSave}
          handleAddNote={handleAddNote}
        />

        {/* Right Sidebar */}
        {rightOpen && (
          <RightSidebar
            username={username}
            setRightOpen={setRightOpen}
            showSharingLog={showSharingLog}
            toggleSharingLog={toggleSharingLog}
            handleLogout={handleLogout}
          />
        )}
      </div>

      {/* File Menu (dropdown inside Navbar) */}
      {fileMenuOpen && (
        <FileMenu
          fileMenuOpen={fileMenuOpen}
          onFileAction={handleFileAction}
          isSummarizing={isSummarizing}
          isPreparing={isPreparing}
        />
      )}

      {/* Modals */}
      <ModalsManager
        showModal={showModal}
        setShowModal={setShowModal}
        modalContent={modalContent}
        modalTitle={modalTitle}
        showRenameModal={showRenameModal}
        setShowRenameModal={setShowRenameModal}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        setNotes={setNotes}
      />
    </div>
  );
};

export default Dashboard;
