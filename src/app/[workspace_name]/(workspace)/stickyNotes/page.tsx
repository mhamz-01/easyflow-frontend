"use client";
import { useQuery } from "@tanstack/react-query";
import { stickyNotesKeys } from "@/src/lib/api/sticky-notes/keys";
import { getAllStickyNotes } from "@/src/lib/api/sticky-notes/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import StickyNoteEditor from "@/src/components/custom/sticky-note-editor/editor";
import StickyNotesLoadingState from "@/src/components/custom/sticky-note-editor/loading-state";
import StickyNotesEmptyState from "@/src/components/custom/sticky-note-editor/empty-state";
import StickyNotesPageHeader from "./header";

const page = () => {
  const { userId } = useAuth();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const { data, isLoading, isError } = useQuery({
    queryKey: stickyNotesKeys.all(userId ?? "", workspace?.id ?? 0),
    queryFn: () =>
      getAllStickyNotes({
        userId: userId ?? "",
        workspaceId: workspace?.id ?? 0,
        limit: 50,
      }),
    enabled: !!userId && !!workspace,
  });

  if (isError) {
    return (
      <div className="mt-5 text-sm text-red-500">Failed to load notes</div>
    );
  }

  return (
    <div>
      <StickyNotesPageHeader />
      {isLoading ? (
        <StickyNotesLoadingState />
      ) : data !== undefined && data.data.length === 0 ? (
        <StickyNotesEmptyState />
      ) : (
        <div
          className={`grid grid-cols-[repeat(auto-fit,280px)] gap-5 mt-5 border-t-2 pt-5`}
        >
          {data?.data.map((note) => (
            <StickyNoteEditor
              bgColor={note.bgColor}
              key={note.id}
              stickyNoteId={note.id}
              content={note.content}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
