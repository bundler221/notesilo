import DraggableModal from "./DraggableModal";
import RenameModal from "./RenameModal";
import { renameNote } from "./NotesEditingFunctionalities";

export default function ModalsManager({
  showModal,
  setShowModal,
  modalContent,
  modalTitle,
  showRenameModal,
  setShowRenameModal,
  selectedNote,
  setSelectedNote,
  setNotes,
}) {
  return (
    <>
      <DraggableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        results={modalContent}
        title={modalTitle}
      />

      <RenameModal
        isOpen={showRenameModal}
        currentTitle={selectedNote?.title}
        onClose={() => setShowRenameModal(false)}
        onRename={(newTitle) => {
          const updated = renameNote(selectedNote, newTitle);
          setSelectedNote(updated);
          setNotes((prev) =>
            prev.map((n) => (n._id === updated._id ? updated : n))
          );
        }}
      />
    </>
  );
}
