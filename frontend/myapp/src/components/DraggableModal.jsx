import MDEditor from "@uiw/react-md-editor";
import { useState, useRef, useEffect } from "react";
import { FiX, FiMinus, FiMaximize2, FiCopy, FiCheck } from "react-icons/fi";

export default function HybridModal({ isOpen, onClose, results, title }) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [dragging, setDragging] = useState(false);
  const [zIndex, setZIndex] = useState(50);
  const dragStart = useRef({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const markdownContent = Array.isArray(results)
    ? results.join("\n\n---\n\n")
    : results || "No results found";

  /** Dragging (PC only) */
  const handleDragStart = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setZIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (isMobile) return;

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
  }, [dragging, isMobile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleBringToFront = () => {
    setZIndex((prev) => prev + 1);
    if (!minimized) {
      setPosition({
        x: window.innerWidth / 2 - size.width / 2,
        y: window.innerHeight / 2 - size.height / 2,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {isMobile ? (
        /* --------- Mobile Modal (no drag) --------- */
        <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-[95vw] max-w-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-b">
            <h2 className="text-sm font-bold truncate">🔍 {title}</h2>
            <div className="flex space-x-2 items-center">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-green-100"
              >
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-red-100"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 overflow-auto prose max-w-none">
            <MDEditor.Markdown source={markdownContent} />
          </div>
        </div>
      ) : (
        /* --------- PC Modal (draggable) --------- */
        <div
          className="bg-white rounded-lg shadow-xl border border-gray-800 transition-all"
          style={{
            width: minimized ? 280 : size.width,
            height: minimized ? 40 : size.height,
            transform: `translate(${position.x}px, ${position.y}px)`,
            pointerEvents: "auto",
            zIndex,
            position: "absolute",
            maxWidth: "95vw",
            maxHeight: "90vh",
          }}
          onDoubleClick={() => setZIndex((prev) => prev + 1)}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center border-b pb-2.5 cursor-move bg-gray-200 px-2 rounded-t-lg"
            onMouseDown={handleDragStart}
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
                  onClick={() => {
                    setMinimized(false);
                    setPosition({
                      x: window.innerWidth / 2 - size.width / 2,
                      y: window.innerHeight / 2 - size.height / 2,
                    });
                  }}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <FiMaximize2 size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMinimized(true);
                    setPosition({
                      x: window.innerWidth * 0.75 - 140,
                      y: 20,
                    });
                  }}
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
            <div
              className="mt-2 prose max-w-none cursor-pointer overflow-auto pl-2"
              style={{ height: size.height - 50 }}
              onClick={handleBringToFront}
            >
              <MDEditor.Markdown source={markdownContent} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
