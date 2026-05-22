"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

export default function DocEditor({ id }: { id: string }) {
  const queryClient = useQueryClient();

  // ✅ Dynamically inject CSS on mount, remove on unmount
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/easyflow-editor.css";
    link.id = "easyflow-editor-styles";
    document.head.appendChild(link);

    return () => {
      const el = document.getElementById("easyflow-editor-styles");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ── Fetch doc ─────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["doc", id],
    queryFn: () => getSingleDoc(Number(id)),
    staleTime: 0,          // ✅ always consider stale
    refetchOnMount: true,  // ✅ always fetch fresh on mount
  });

  // ── Save mutation ─────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: () => {
      // ✅ bust cache so next mount fetches fresh
      queryClient.invalidateQueries({ queryKey: ["doc", id] });
    },
    onError: (err) => {
      console.error("❌ Doc save failed:", err);
    },
  });

  // ✅ stable ref so useCallback doesn't depend on mutation object
  const mutationRef = useRef(mutation);
  mutationRef.current = mutation;

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Save handler ──────────────────────────────────────────────────
  const handleChange = useCallback(
    (payload: any) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        const docId = Number(id);
        const now = new Date().toISOString();

        // ✅ save content first, then lastEdited sequentially
        // not simultaneously — avoids race condition
        try {
          await mutationRef.current.mutateAsync({
            id: docId,
            columnName: "content",
            value: payload.tabs,
          });
          await mutationRef.current.mutateAsync({
            id: docId,
            columnName: "lastEdited",
            value: now,
          });
        } catch (err) {
          console.error("❌ Failed to save doc:", err);
        }
      }, 800);
    },
    [id],
  );

  // ── Cleanup debounce on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

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