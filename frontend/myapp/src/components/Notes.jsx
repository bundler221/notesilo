/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import NoteEditor from "./NoteEditor";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const navigate = useNavigate(); 
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState("user");
  const [selectedNote, setSelectedNote] = useState(null);
  const token = localStorage.getItem("token");

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

  const handleAddNote = () => setSelectedNote({}); // empty note

  const handleNoteSave = (savedNote) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n._id === savedNote._id);
      if (exists) return prev.map((n) => (n._id === savedNote._id ? savedNote : n));
      return [savedNote, ...prev];
    });
    setSelectedNote(savedNote);
  };

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Welcome, {username}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleAddNote}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Add Note
          </button>
          <button
            onClick={() => navigate("/graph")}   // ✅ fixed
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Graph
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/6 p-4 border-r overflow-y-auto">
          <h2 className="font-semibold mb-4">Your Notes</h2>
          {notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id || note.title}
                onClick={() => setSelectedNote(note)}
                className={`p-3 mb-2 border rounded cursor-pointer ${
                  selectedNote === note ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <h3 className="font-semibold">{note.title || "Untitled Note"}</h3>
              </div>
            ))
          )}
        </aside>

        <section className="flex-1 p-4">
  <h2 className="text-lg font-semibold mb-2">Editor</h2>
  {selectedNote ? (
    <NoteEditor
      note={selectedNote}
      token={token}
      onSave={handleNoteSave}
      canEdit={selectedNote.canWrite} // ✅ use backend flag
    />
  ) : (
    <p className="text-gray-500">Select a note or add a new one</p>
  )}
</section>

      </div>
    </div>
  );
}
