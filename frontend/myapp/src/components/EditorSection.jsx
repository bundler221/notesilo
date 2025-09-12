import NoteEditor from "./NoteEditor";

export default function EditorSection({ selectedNote, token, onSave }) {
  return (
    <section className="flex-1 p-4">
      <h2 className="text-lg font-semibold mb-2">Editor</h2>
      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          token={token}
          onSave={onSave}
          canEdit={selectedNote.canWrite}
        />
      ) : (
        <p className="text-gray-500">Select a note or add a new one</p>
      )}
    </section>
  );
}
