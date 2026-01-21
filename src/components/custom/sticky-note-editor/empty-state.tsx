import { StickyNotesIcon } from "./sticky-notes-icon";

const StickyNotesEmptyState = () => {
  return (
    <div className="bg-background-200 h-60 mt-5 p-5 flex flex-col items-center justify-center rounded text-center">
      <StickyNotesIcon />
      <p className="max-w-sm text-sm text-muted-foreground">
        Capture ideas, insights, and moments of inspiration. Add a sticky to
        begin.
      </p>
    </div>
  );
};

export default StickyNotesEmptyState;
