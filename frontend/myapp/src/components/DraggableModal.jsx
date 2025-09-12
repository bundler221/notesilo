// DraggableModal.jsx
import MDEditor from "@uiw/react-md-editor";
import { useState, useRef, useEffect } from "react";
import { FiX, FiMinus, FiMaximize2, FiCopy, FiCheck } from "react-icons/fi";

export default function DraggableModal({ isOpen, onClose, results, title }) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  // Convert array → single markdown string
  const markdownContent = Array.isArray(results)
    ? results.join("\n\n---\n\n")
    : results || "No results found";

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        e.preventDefault();
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "auto";
    };
  }, [dragging]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ⬇️ Only render UI when open, but hooks are always executed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className={`bg-white/90 rounded-lg shadow-xl border border-gray-800 transition-all
          ${minimized
            ? "w-72 h-10 flex items-center justify-between px-4 cursor-pointer fixed top-4 right-40"
            : "w-[700px] max-h-[500px] p-2 overflow-y-auto absolute"
          }`}
        style={{
          transform: minimized
            ? "none"
            : `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "auto",
        }}
      >
        {/* Header (draggable only here) */}
        <div
          className={`flex justify-between items-center border-b pb-2 ${
            minimized ? "border-0 w-full h-full" : ""
          } cursor-move bg-gray-200 px-2 py-1 rounded-t-lg`}
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-sm font-bold truncate select-none">
            {minimized ? `🔍 ${title} (Minimized)` : `🔍 ${title}`}
          </h2>
          <div className="flex space-x-2 items-center">
            {!minimized && (
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-green-200"
                title="Copy results"
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
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-red-200"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!minimized && (
          <div className="mt-4 prose max-w-none">
            <MDEditor.Markdown source={markdownContent} />
          </div>
        )}
      </div>
    </div>
  );
}
