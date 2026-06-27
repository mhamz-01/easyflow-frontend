"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

export default function DocEditor({ id }: { id: string }) {
  const queryClient = useQueryClient();

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

  // ── Fetch doc ────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["doc", id],
    queryFn: () => getSingleDoc(Number(id)),
    staleTime: Infinity,      // ✅ fetch once, never refetch automatically
    refetchOnMount: true,     // ✅ but always fetch fresh on first mount
    refetchOnWindowFocus: false, // ✅ don't refetch on tab switch
  });

  // ── Save mutation ────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: (_, variables) => {
      // ✅ update cache directly — NO invalidateQueries (prevents remount)
      if (variables.columnName === "content") {
        queryClient.setQueryData(["doc", id], (oldData: any) => ({
          ...oldData,
          document: { ...oldData?.document, content: variables.value },
        }));
      }
    },
    onError: (err) => {
      console.error("❌ Doc save failed:", err);
    },
  });

  const mutationRef = useRef(mutation);
  mutationRef.current = mutation;

  // ── Save handler — NO extra debounce here ────────────────────────
  // Library already debounces at 800ms internally, don't double-stack
  const handleChange = useCallback(
    async (payload: any) => {
      const docId = Number(id);
      const now = new Date().toISOString();
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
    },
    [id],
  );

  // ── Stable initialTabs — never changes after first load ──────────
  const initialTabsRef = useRef<any>(null);
  const isInitializedRef = useRef(false); 
  if (!isInitializedRef.current && data !== undefined) {
    // data loaded (even if content is null/empty) → initialize
    isInitializedRef.current = true;
    initialTabsRef.current = data?.document.content ?? [];
  }
  // ── Don't render Editor until we have real data ──────────────────
  if (isLoading || !isInitializedRef.current) {
    return <div className="h-full w-full rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="h-full w-full overflow-hidden"> {/* ← add overflow-hidden */}
      <Editor
        initialTabs={initialTabsRef.current}
        onChange={handleChange}
      />
    </div>
  )
}