"use client";

import StickyNotesHeader from "./header";
import { useQuery } from "@tanstack/react-query";
import { stickyNotesKeys } from "@/src/lib/api/sticky-notes/keys";
import { getAllStickyNotes } from "@/src/lib/api/sticky-notes/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import StickyNoteEditor from "@/src/components/custom/sticky-note-editor/editor";
import StickyNotesLoadingState from "@/src/components/custom/sticky-note-editor/loading-state";
import StickyNotesEmptyState from "@/src/components/custom/sticky-note-editor/empty-state";

const StickyNotes = () => {
  const { userId } = useAuth();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [dataLength, setDataLength] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: stickyNotesKeys.all(userId ?? "", workspace?.id ?? 0),
    queryFn: () =>
      getAllStickyNotes({
        userId: userId ?? "",
        workspaceId: workspace?.id ?? 0,
      }),
    enabled: !!userId && !!workspace,
  });

  useEffect(() => {
    if (data?.data?.length) {
      setDataLength(data?.data.length);
    }
  }, [data?.data]);

  if (isError) {
    return (
      <div className="mt-5 text-sm text-red-500">Failed to load notes</div>
    );
  }

  return (
    <div className="border-t-2 mt-5 pt-5">
      <StickyNotesHeader />
      {isLoading ? (
        <StickyNotesLoadingState />
      ) : data !== undefined && data.data.length === 0 ? (
        <StickyNotesEmptyState />
      ) : (
        <div
          className={`relative ${
            dataLength <= 2
              ? "flex"
              : "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
          } gap-5 mt-5`}
        >
          {data?.data.map((note) => (
            <StickyNoteEditor
              bgColor={note.bgColor}
              key={note.id}
              stickyNoteId={note.id}
              content={note.content}
            />
          ))}
          {/* Bottom overlay only if data exists */}
          {data?.data.length && data?.data.length === 6 && (
            <div className="absolute inset-x-0 bottom-0 h-34 bg-linear-to-t from-black via-black/65 to-transparent flex items-end justify-center pb-4">
              <Link
                href={`${workspace?.workspaceSlug}/stickyNotes`}
                className="text-primary-blue hover:text-primary-blue dark:hover:bg-transparent cursor-pointer"
              >
                Show more
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StickyNotes;
