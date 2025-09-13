import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DraggableModal from "./DraggableModal";

export default function NoteActions({ note, token, canEdit, onSave }) {
  const [showShare, setShowShare] = useState(false);
  const [shareUser, setShareUser] = useState(null);
  const [typedUser, setTypedUser] = useState("");
  const [accessLevel, setAccessLevel] = useState("read");
  const [results, setResults] = useState([]);

  // ✅ Summarization & Questions
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/summarize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.summary || "No summary returned");
      setShowSummary(true);
    } catch (err) {
      console.error("❌ Summarization failed:", err);
      toast.error("Failed to summarize note");
    } finally {
      setLoadingSummary(false);
    }
  };

  // ✅ Questions
  const handleQuestions = async () => {
    if (!note?._id) return;
    setLoadingQuestions(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/questions`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(res.data.questions || "No questions returned");
      setShowQuestions(true);
    } catch (err) {
      console.error("❌ Questions fetch failed:", err);
      toast.error("Failed to generate questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // ✅ Export PDF
  const handleExportPDF = async () => {
    if (!note?._id) {
      toast.error("No note to export.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/export/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${note.title || "note"}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("PDF exported!");
    } catch (err) {
      console.error("❌ PDF export failed:", err);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2 relative">
      {canEdit && (
        <>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-black text-white px-4 py-2 rounded-md font-medium shadow-sm transition"
          >
            Save
          </button>

          {note?._id && (
            <>
              <button
                onClick={handleDelete}
                className="bg-red-500  hover:bg-black  text-white px-4 py-2 rounded-md font-medium shadow-sm transition"
              >
                Delete
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="bg-slate-500 border  text-white hover:bg-black px-4 py-2 rounded-md font-medium shadow-sm transition"
              >
                Share
              </button>

              {/* <button
                onClick={handleSummarize}
                disabled={loadingSummary}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition disabled:opacity-50"
              >
                {loadingSummary ? "Summarizing..." : "Summarize"}
              </button>

              <button
                onClick={handleQuestions}
                disabled={loadingQuestions}
                className="bg-green-50 border border-green-600 text-green-700 hover:bg-green-100 px-4 py-2 rounded-md font-medium shadow-sm transition disabled:opacity-50"
              >
                {loadingQuestions ? "Generating..." : "Get Questions"}
              </button> */}
            </>
          )}
        </>
      )}

      {/* Floating Share Panel */}
      {showShare && (
        <div className="fixed top-24 right-10 bg-white border shadow-lg rounded p-4 z-50 w-80">
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
                  className="px-2 py-1 hover:bg-green-50 cursor-pointer"
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
            className="border p-2 w-full mb-2 rounded "
          >
            <option value="read" className="hover:bg-gray-800">Read</option>
            <option value="write" className="hover:bg-gray-800">Write</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowShare(false)}
              className="bg-red-500 text-white hover:bg-red-700 px-3 py-1 rounded-md font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="bg-slate-600 hover:bg-black  text-white px-3 py-1 rounded-md font-medium transition"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* Use DraggableModal for summary */}
      <DraggableModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        results={summary}
      />

      {/* Use DraggableModal for questions */}
      <DraggableModal
        isOpen={showQuestions}
        onClose={() => setShowQuestions(false)}
        results={questions}
      />

      {/* <button
        onClick={handleExportPDF}
        className="bg-green-50 border border-green-600 text-green-700 hover:bg-green-100 px-4 py-2 rounded-md font-medium shadow-sm transition"
      >
        Export PDF
      </button> */}
    </div>
  );
}
