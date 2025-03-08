/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SharingLog({ token, onClose }) {
  const [notes, setNotes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Decode user id from JWT
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

      const notesWithUsers = await Promise.all(
        res.data.map(async (note) => {
          if (!note.sharedWith?.length) {
            return { ...note, sharedWithUsers: [] };
          }

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:justify-end">
      {/* Background overlay (mobile usability) */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      <div
        className="
          relative bg-gray-900 text-white rounded-t-lg md:rounded-lg shadow-lg
          w-full h-[80vh] md:h-auto md:w-96
          mt-auto md:mt-20 md:mr-4
          max-h-[80vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-lg sticky top-0">
          <h2 className="font-bold text-lg">Sharing Log</h2>
          <button
            onClick={onClose}
            aria-label="Close sharing log"
            className="text-gray-300 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-400">No notes available</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <h3 className="font-semibold text-center bg-gray-700 px-3 py-2">
                  File: {note.title || "Untitled Note"}
                </h3>

                {note.owner === currentUserId ? (
                  <div className="p-3 space-y-3">
                    <p className="text-sm text-gray-300">Shared With:</p>
                    {note.sharedWithUsers?.length ? (
                      <ul className="space-y-3">
                        {note.sharedWithUsers.map((sw) => (
                          <li
                            key={sw.userId}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">
                                {sw.userNameOrEmail}
                              </span>
                              <select
                                value={sw.accessLevel}
                                onChange={(e) =>
                                  updateAccess(note._id, sw.userId, e.target.value)
                                }
                                className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 text-sm"
                              >
                                <option value="read">Read</option>
                                <option value="write">Write</option>
                                <option value="comment">Comment</option>
                              </select>
                            </div>
                            <button
                              onClick={() => revokeAccess(note._id, sw.userId)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                            >
                              Revoke
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-200">Not shared with anyone</p>
                    )}
                  </div>
                ) : (
                  <p className="p-3 text-sm text-gray-200">
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
      </div>
    </div>
  );
}
