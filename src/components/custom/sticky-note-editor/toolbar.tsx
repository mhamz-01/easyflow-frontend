import { Button } from "@/src/components/shadcn/button";

import { Bold, ListChecks } from "lucide-react";
import DeleteStickyNoteButton from "./delete-sticky";
import { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
  stickyNoteId: number;
}

const StickyNotesEditorToolbar = ({ editor, stickyNoteId }: ToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="flex justify-between gap-1 border-t pt-2">
      <div className="flex items-center gap-1">
        {/* Bold */}
        <Button
          size="icon"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        {/* Checklist */}
        <Button
          size="icon"
          variant={editor.isActive("taskList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListChecks className="h-4 w-4" />
        </Button>
      </div>
      {/* Delete */}
      <DeleteStickyNoteButton editor={editor} stickyNoteId={stickyNoteId} />
    </div>
  );
};

export default StickyNotesEditorToolbar;
