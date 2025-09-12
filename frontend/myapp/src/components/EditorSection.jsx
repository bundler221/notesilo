import NoteEditor from "./NoteEditor";
import NoteEdituh from "./NoteEdituh";

export default function EditorSection({ selectedNote, token, onSave }) {
  return (
    <section className="flex-1 p-4">
      
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
