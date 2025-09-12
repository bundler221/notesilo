import MDEditor from "@uiw/react-md-editor";
import { useState, useRef, useEffect } from "react";
import { FiX, FiMinus, FiMaximize2, FiCopy, FiCheck } from "react-icons/fi";

export default function DraggableModal({ isOpen, onClose, results, title }) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  // eslint-disable-next-line no-unused-vars
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [dragging, setDragging] = useState(false);
  const [zIndex, setZIndex] = useState(50);
  const dragStart = useRef({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const markdownContent = Array.isArray(results)
    ? results.join("\n\n---\n\n")
    : results || "No results found";

  /** Dragging */
  const handleDragStart = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setZIndex((prev) => prev + 1); // Bring to front
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
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

  /** Bring to front & center when bottom clicked */
  const handleBringToFront = () => {
    setZIndex((prev) => prev + 1);
    setPosition({
      x: window.innerWidth / 2 - size.width / 2,
      y: window.innerHeight / 2 - size.height / 2,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className={`bg-white rounded-lg shadow-xl border border-gray-800 transition-all`}
        style={{
          width: minimized ? 280 : size.width,
          height: minimized ? 40 : size.height,
          transform: minimized ? "none" : `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "auto",
          zIndex,
          position: "absolute",
        }}
        onDoubleClick={() => setZIndex((prev) => prev + 1)} // Optional: double click also brings front
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center border-b pb-1 cursor-move bg-gray-200 px-2 rounded-t-lg`}
          onMouseDown={handleDragStart}
        >
          <h2 className="text-sm font-bold truncate select-none">
            {minimized ? `🔍 ${title} (Minimized)` : `🔍 ${title}`}
          </h2>
          <div className="flex space-x-2 items-center">
            {!minimized && (
              <button onClick={handleCopy} className="p-1 rounded hover:bg-green-200">
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            )}
            {minimized ? (
              <button onClick={() => setMinimized(false)} className="p-1 rounded hover:bg-gray-200">
                <FiMaximize2 size={16} />
              </button>
            ) : (
              <button onClick={() => setMinimized(true)} className="p-1 rounded hover:bg-gray-200">
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
          <div
            className="mt-2 prose max-w-none h-full cursor-pointer"
            onClick={handleBringToFront} // Click anywhere inside content brings front & center
          >
            <MDEditor.Markdown source={markdownContent} />
          </div>
        )}
      </div>
    </div>
  );
}
