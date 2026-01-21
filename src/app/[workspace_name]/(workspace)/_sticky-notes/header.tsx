import AddStickyNoteButton from "@/src/components/custom/sticky-note-editor/add-sticky";

const StickyNotesHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-h1">Sticky Notes</h1>
      {/* search input + add note button */}
      <AddStickyNoteButton />
    </div>
  );
};
export default StickyNotesHeader;
