import React from "react";
import NoteEditor from "./NoteEditor";

const NoteArea = ({ selectedNote, token, handleNoteSave, handleAddNote }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          token={token}
          onSave={handleNoteSave}
        />
      ) : (
        <div className="text-gray-500 text-center mt-20">
          <p>No note selected.</p>
          <button
            onClick={handleAddNote}
            className="mt-4 px-3 py-2 bg-blue-500 text-white rounded"
          >
            + Create a Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteArea;
