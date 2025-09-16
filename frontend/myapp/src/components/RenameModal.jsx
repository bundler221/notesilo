import { useState, useEffect } from "react";

export default function RenameModal({ isOpen, onClose, onRename, currentTitle }) {
  const [newTitle, setNewTitle] = useState(currentTitle || "");

  useEffect(() => {
    if (isOpen) setNewTitle(currentTitle || "");
  }, [isOpen, currentTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Rename Note</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4 focus:ring focus:ring-blue-300"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (newTitle.trim()) {
                onRename(newTitle.trim());
                onClose();
              }
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
