import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { summarizeNoteAPI, prepareQuestionsAPI } from "./NotesEditingFunctionalities";

export default function NoteActions({ note, token, canEdit, onSave }) {
  const [showShare, setShowShare] = useState(false);
  const [shareUser, setShareUser] = useState(null);
  const [typedUser, setTypedUser] = useState("");
  const [accessLevel, setAccessLevel] = useState("read");
  const [results, setResults] = useState([]);

  // ✅ Summarization
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // ✅ Questions
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const searchUsers = async (q) => {
    if (!q) return setResults([]);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/search?q=${q}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (err) {
      console.error("❌ User search failed:", err);
    }
  };

  // ✅ Save
  const handleSave = async () => {
    if (!canEdit) return;
    try {
      const url = note?._id
        ? `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`
        : `${import.meta.env.VITE_API_URL}/api/notes`;
      const method = note?._id ? "put" : "post";

      const res = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: { title: note.title, content: note.content },
      });

      onSave?.({ ...res.data, canWrite: true });
      toast.success("Note saved!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      toast.error("Failed to save.");
    }
  };

  // ✅ Delete
  const handleDelete = async () => {
    if (!canEdit || !note?._id) return;
    if (!confirm("Delete this note?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note deleted!");
      onSave?.(null);
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error("Failed to delete.");
    }
  };

  // ✅ Share
  const handleShare = async () => {
    if (!note?._id) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/share`,
        { userId: shareUser._id, accessLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note shared!");
      setShowShare(false);
      setShareUser("");
      setAccessLevel("read");
    } catch (err) {
      console.error("❌ Share failed:", err);
      toast.error("Failed to share.");
    }
  };

  // ✅ Summarize
  const handleSummarize = async () => {
    if (!note?._id) return;
    setLoadingSummary(true);
    try {
      const summary = await summarizeNoteAPI(note._id, token);
      setSummary(summary);
      setShowSummary(true);
    } catch (err) {
      console.error("❌ Summarization failed:", err);
      toast.error("Failed to summarize note");
    } finally {
      setLoadingSummary(false);
    }
  };

  // ✅ Prepare Questions
  const handleQuestions = async () => {
    if (!note?._id) return;
    setLoadingQuestions(true);
    try {
      const qs = await prepareQuestionsAPI(note._id, token);
      setQuestions(qs);
      setShowQuestions(true);
    } catch (err) {
      console.error("❌ Question generation failed:", err);
      toast.error("Failed to prepare questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="mt-3 flex gap-2 relative">
      {canEdit && (
        <>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>

          {note?._id && (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Share
              </button>

              <button
                onClick={handleSummarize}
                disabled={loadingSummary}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                {loadingSummary ? "Summarizing..." : "Summarize"}
              </button>

              <button
                onClick={handleQuestions}
                disabled={loadingQuestions}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
              >
                {loadingQuestions ? "Preparing..." : "Prepare Questions"}
              </button>
            </>
          )}
        </>
      )}

      {/* Floating share panel */}
      {showShare && (
        <div className="absolute top-10 right-10 bg-white border shadow-lg rounded p-4 z-50 w-80">
          <h3 className="font-semibold mb-2">Share Note</h3>
          <input
            type="text"
            placeholder="Search user by email/username"
            value={shareUser ? shareUser.username || shareUser.email : typedUser}
            onChange={(e) => {
              setTypedUser(e.target.value);
              setShareUser(null);
              searchUsers(e.target.value);
            }}
            className="border p-2 w-full mb-2 rounded"
          />

          {results.length > 0 && (
            <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto">
              {results.map((u) => (
                <li
                  key={u._id}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setShareUser(u);
                    setTypedUser("");
                    setResults([]);
                  }}
                >
                  {u.username || u.email}
                </li>
              ))}
            </ul>
          )}

          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowShare(false)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* Summary dialog */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="font-semibold text-lg mb-4">Note Summary</h3>
            <p className="whitespace-pre-line">{summary}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions dialog */}
      {showQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="font-semibold text-lg mb-4">Prepared Questions</h3>
            <ul className="list-disc list-inside space-y-2">
              {questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowQuestions(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
