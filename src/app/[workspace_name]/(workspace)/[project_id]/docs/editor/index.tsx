"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import "@mhamz.01/easyflow-texteditor/dist/index.css";
import { useCallback, useRef } from "react";

export default function DocEditor({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["doc", id],
    queryFn: () => getSingleDoc(Number(id)),
  });

  const mutation = useMutation({ mutationFn: updateDoc });

  // Debounce: wait 800ms after user stops typing before saving
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (payload: any) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        mutation.mutate({
          id: Number(id),
          columnName: "content",
          value: payload.tabs,
        });
      }, 800);
    },
    [id]
  );

  if (isLoading) {
    return <div className="h-full w-full rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="easyflow-editor h-full">
      <Editor
        initialTabs={data?.document.content ?? []}
        onChange={handleChange}
      />
    </div>
  );
}