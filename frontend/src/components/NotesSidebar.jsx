import NoteSearch from "./NoteSearch";

export default function NotesSidebar({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  open, 
  setOpen 
}) {
  const handleToggleNote = (note) => {
    const newActive = selectedNote === note ? null : note;
    onSelectNote(newActive);
    setOpen(false); // ✅ auto-close
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 pt-6 flex flex-col gap-3 h-full">
        {/* Search bar */}
        <NoteSearch
          notes={notes}
          onSelectNote={(note) => {
            onSelectNote(note);
            setOpen(false); // ✅ close on search select
          }}
        />

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto mt-3 mb-4 flex flex-col gap-2">
          {notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            notes.map((note) => {
              const isActive = selectedNote === note;
              return (
                <div
                  key={note._id || note.title}
                  onClick={() => handleToggleNote(note)}
                  className="p-3 border rounded cursor-pointer transition-colors duration-200"
                  style={{
                    backgroundColor: isActive ? "#00cc44" : "white",
                    color: isActive ? "white" : "black",
                  }}
                >
                  <h3 className="font-semibold">
                    {note.title || "Untitled Note"}
                  </h3>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
