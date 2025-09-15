// HybridModal.jsx
import { useState } from "react";
import { Rnd } from "react-rnd";
import MDEditor from "@uiw/react-md-editor";
import { FiX, FiMinus, FiMaximize2, FiCopy, FiCheck } from "react-icons/fi";

export default function DraggableModal({ isOpen, onClose, results, title }) {
  const [minimized, setMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = Array.isArray(results)
    ? results.join("\n\n---\n\n")
    : results || "No results found";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ----------------- MOBILE VERSION -----------------
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2">
        <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-full max-w-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-b">
            <h2 className="text-sm font-bold truncate">🔍 {title}</h2>
            <div className="flex space-x-2 items-center">
              <button onClick={handleCopy} className="p-1 rounded hover:bg-green-100">
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
              <button onClick={onClose} className="p-1 rounded hover:bg-red-100">
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 overflow-auto prose max-w-none flex-1">
            <MDEditor.Markdown source={markdownContent} />
          </div>
        </div>
      </div>
    );
  }

  // ----------------- PC VERSION -----------------
  return (
    <Rnd
      default={{
        x: window.innerWidth / 4,
        y: window.innerHeight / 4,
        width: 700,
        height: 500,
      }}
      minWidth={300}
      minHeight={40}
      bounds="window"
      dragHandleClassName="modal-header"
      enableResizing={!minimized}
      className="z-50"
    >
      <div
        className={`bg-white rounded-lg shadow-xl border border-gray-800 flex flex-col ${
          minimized ? "h-10 w-72" : "h-full"
        }`}
      >
        {/* Header */}
        <div
          className="modal-header flex justify-between items-center border-b pb-2.5 cursor-move bg-gray-200 px-2 rounded-t-lg"
        >
          <h2 className="text-sm font-bold truncate select-none pt-2.5">
            {minimized ? `🔍 ${title} (Minimized)` : `🔍 ${title}`}
          </h2>
          <div className="flex space-x-2 items-center">
            {!minimized && (
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-green-200"
              >
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            )}
            {minimized ? (
              <button
                onClick={() => setMinimized(false)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <FiMaximize2 size={16} />
              </button>
            ) : (
              <button
                onClick={() => setMinimized(true)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <FiMinus size={16} />
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded hover:bg-red-200">
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!minimized && (
          <div className="flex-1 overflow-auto prose max-w-none p-2">
            <MDEditor.Markdown source={markdownContent} />
          </div>
        )}
      </div>
    </Rnd>
  );
}
