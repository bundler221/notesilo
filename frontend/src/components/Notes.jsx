/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import NoteEditor from "./NoteEditor";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SharingLog from "./SharingLog";
import NoteSearch from "./NoteSearch";
import NotesSidebar from "./NotesSidebar";
import NotesHeader from "./NotesHeader";
import EditorSection from "./EditorSection";





export default function Notes() {
  const navigate = useNavigate(); 
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("user");
  const [selectedNote, setSelectedNote] = useState(null);
  const token = localStorage.getItem("token");
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  

  
  // Decode JWT to get username
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const oauthUsername = params.get("username");
  if (oauthUsername) {
    localStorage.setItem("username", oauthUsername);
    setUsername(oauthUsername);
  } else if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      
      setUsername(decoded.username || "user");
    } catch (err) {
      console.error("Invalid token:", err);
      setUsername("user");
    }
  }
}, [token]);

  


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

const handleAddNote = () => {
  setSelectedNote({ title: "Untitled", content: "", canWrite: true });
};



const handleNoteSave = (savedNote) => {
  if (!savedNote) {
    setNotes(prev => prev.filter(n => n._id !== selectedNote?._id));
    setSelectedNote(null);
    return;
  }

  setNotes(prev => {
    const exists = prev.find(n => n._id === savedNote._id);
    return exists ? prev.map(n => (n._id === savedNote._id ? savedNote : n)) : [savedNote, ...prev];
  });

  setSelectedNote(prev => {
    if (!prev) return savedNote;
    const mergedContent = (savedNote.content === "" && prev.content) ? prev.content : savedNote.content;
    return { ...savedNote, content: mergedContent };
  });
};



  const handleLogout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NotesHeader
  username={username}
  notes={notes}
  onSelectNote={setSelectedNote}
  onAddNote={handleAddNote}
  onToggleSidebar={() => setShowSidebar((prev) => !prev)} // ✅ toggle sidebar
  showSidebar={showSidebar} // ✅ pass down
  onTogglePanel={() => setShowNotesPanel(prev => !prev)}
  showNotesPanel={showNotesPanel}
  onLogout={handleLogout}
  onNavigateGraph={() => navigate("/graph")}
/>



     <div className="flex flex-1 overflow-hidden">
  

  <EditorSection
    selectedNote={selectedNote}
    token={token}
    onSave={handleNoteSave}
  />
</div>

      {showNotesPanel && (
  <SharingLog token={token} onClose={() => setShowNotesPanel(false)} />
)}

    </div>
  );
}
