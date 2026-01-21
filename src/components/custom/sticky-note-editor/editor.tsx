"use client";

import "./style.css";
import { useRef, useEffect } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import { updateStickyNote } from "@/src/lib/api/sticky-notes/services";
import StickyNotesEditorToolbar from "./toolbar";

interface StickyNoteEditorProps {
  content?: JSONContent;
  bgColor: string;
  stickyNoteId: number;
}

const StickyNoteEditor = ({
  content,
  bgColor,
  stickyNoteId,
}: StickyNoteEditorProps) => {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Start typing here..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      // clear previous debounce
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // debounce API call
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          await updateStickyNote({
            id: stickyNoteId,
            isEmpty: editor.isEmpty,
            content,
          });
        } catch (err) {
          console.error("Failed to update sticky note", err);
        }
      }, 400); // 500ms debounce
    },
  });

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  if (!editor) return null;

  return (
    <div
      className="rounded-md border p-3 w-70 h-87.5 flex flex-col gap-2 transition-colors"
      style={{ backgroundColor: bgColor }}
    >
      <div className="content-area flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>

      <StickyNotesEditorToolbar editor={editor} stickyNoteId={stickyNoteId} />
    </div>
  );
};

export default StickyNoteEditor;
