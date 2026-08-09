"use client";

import { useMemo, useState } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { FileStack } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { sanitizeTiptapContent } from "./sanitize-tiptap-content";
import "./doc-content-viewer.css";

type ContentTab = {
  id: string;
  title: string;
  content: JSONContent;
  subtabs: [] | ContentTab[];
};

const ReadOnlyTiptap = ({ content }: { content: JSONContent }) => {
  const safeContent = useMemo(() => sanitizeTiptapContent(content), [content]);

  const editor = useEditor(
    {
      editable: false,
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        TaskList,
        TaskItem.configure({ nested: true }),
      ],
      content: safeContent,
    },
    [safeContent],
  );

  if (!editor) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="doc-preview-content">
      <EditorContent editor={editor} />
    </div>
  );
};

const DocContentViewer = ({ tabs }: { tabs: ContentTab[] | null }) => {
  const [activeTopId, setActiveTopId] = useState(tabs?.[0]?.id ?? "");
  const [activeSubId, setActiveSubId] = useState<string | null>(null);

  if (!tabs || tabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
        <FileStack className="size-8" />
        <p className="text-sm">This document is empty.</p>
      </div>
    );
  }

  const activeTop = tabs.find((t) => t.id === activeTopId) ?? tabs[0];
  const subtabs = activeTop.subtabs ?? [];
  const activeSub = activeSubId ? subtabs.find((t) => t.id === activeSubId) : undefined;
  const active = activeSub ?? activeTop;

  const selectTop = (id: string) => {
    setActiveTopId(id);
    setActiveSubId(null);
  };

  return (
    <div className="flex h-full flex-col">
      {tabs.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 border-b px-6 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTop(tab.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                activeTopId === tab.id
                  ? "bg-primary-blue/15 text-primary-blue"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {tab.title || "Untitled"}
            </button>
          ))}
        </div>
      )}

      {subtabs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-6 pt-3 text-xs">
          <span className="text-muted-foreground">{activeTop.title || "Untitled"}</span>
          <span className="text-muted-foreground">/</span>
          {subtabs.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubId(sub.id)}
              className={cn(
                "rounded-full px-2.5 py-0.5 font-medium transition-colors",
                (activeSubId ?? subtabs[0]?.id) === sub.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {sub.title || "Untitled"}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h2 className="mb-4 text-xl font-semibold">{active.title || "Untitled"}</h2>
        <ReadOnlyTiptap content={active.content} />
      </div>
    </div>
  );
};

export default DocContentViewer;
