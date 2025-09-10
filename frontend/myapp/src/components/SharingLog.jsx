
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SharingLog({ token }) {
  const [notes, setNotes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user's ID from token
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload._id || payload.id);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, [token]);

  // Fetch notes with user info
  const fetchNotes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Populate user info for sharedWith
      const notesWithUsers = await Promise.all(
        res.data.map(async (note) => {
          if (!note.sharedWith?.length) return { ...note, sharedWithUsers: [] };

          const sharedWithUsers = await Promise.all(
            note.sharedWith.map(async (sw) => {
              try {
                const userRes = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/users/${sw.userId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                return {
                  ...sw,
                  userNameOrEmail: userRes.data.username || userRes.data.email,
                };
              } catch {
                return { ...sw, userNameOrEmail: sw.userId };
              }
            })
          );

          return { ...note, sharedWithUsers };
        })
      );

      setNotes(notesWithUsers);
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  // Revoke access
  const revokeAccess = async (noteId, userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/revoke`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Access revoked!");
      fetchNotes();
    } catch {
      toast.error("Failed to revoke access.");
    }
  };

  // Update access
  const updateAccess = async (noteId, userId, newLevel) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/share`,
        { userId, accessLevel: newLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Access updated!");
      fetchNotes();
    } catch {
      toast.error("Failed to update access.");
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  if (loading) {
    return (
      <div className="fixed top-20 right-4 w-96 bg-white border shadow-lg rounded-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Sharing Log</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 w-96 bg-white border shadow-lg rounded-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Sharing Log</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes available</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="border p-3 rounded mb-3">
            <h3 className="font-semibold mb-2">{note.title || "Untitled Note"}</h3>

            {note.owner === currentUserId ? (
              <>
                <p className="text-sm text-gray-600 mb-2">Shared With:</p>
                {note.sharedWithUsers?.length ? (
                  <ul className="space-y-2">
                    {note.sharedWithUsers.map((sw) => (
                      <li
                        key={sw.userId}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{sw.userNameOrEmail}</span>
                          <select
                            value={sw.accessLevel}
                            onChange={(e) =>
                              updateAccess(note._id, sw.userId, e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="read">Read</option>
                            <option value="write">Write</option>
                            <option value="comment">Comment</option>
                          </select>
                        </div>
                        <button
                          onClick={() => revokeAccess(note._id, sw.userId)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Revoke
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Not shared with anyone</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                ✅ Shared with you (access:{" "}
                {
                  note.sharedWithUsers?.find(
                    (sw) => sw.userId === currentUserId
                  )?.accessLevel
                }
                )
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
