"use client";

import { getSingleDoc, updateDoc } from "@/src/lib/api/documents/services";
import { docsKeys } from "@/src/lib/api/documents/keys";
import { Editor } from "@mhamz.01/easyflow-texteditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { Lock } from "lucide-react";

export default function DocEditor({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const docId = Number(id);

  // ── Fetch doc ────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: docsKeys.single(docId),
    queryFn: () => getSingleDoc(docId),
    staleTime: Infinity,      // ✅ fetch once, never refetch automatically
    refetchOnMount: true,     // ✅ but always fetch fresh on first mount
    refetchOnWindowFocus: false, // ✅ don't refetch on tab switch
  });

  // Resolved by the backend (requireDocumentAccess) at fetch time —
  // "edit" unconditionally for private docs, otherwise the requester's
  // effective view/edit level on this public doc.
  const isReadOnly = data?.access === "view";

  // ── Save mutation ────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: (_, variables) => {
      // ✅ update cache directly — NO invalidateQueries (prevents remount)
      if (variables.columnName === "content") {
        queryClient.setQueryData(docsKeys.single(docId), (oldData: any) => ({
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
      // Belt-and-suspenders: the editor is already non-editable via the
      // `editable` prop, so this shouldn't fire — but don't persist a
      // write the backend would reject anyway if it somehow does.
      if (isReadOnly) return;
      try {
        await mutationRef.current.mutateAsync({
          id: docId,
          columnName: "content",
          value: payload.tabs,
        });
      } catch (err) {
        console.error("❌ Failed to save doc:", err);
      }
    },
    [docId, isReadOnly],
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
    <div className="h-full w-full overflow-hidden relative"> {/* ← add overflow-hidden */}
      {isReadOnly && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Lock size={12} />
          View only
        </div>
      )}
      <Editor
        initialTabs={initialTabsRef.current}
        onChange={handleChange}
        editable={!isReadOnly}
        restrictTabActions={isReadOnly}
      />
    </div>
  )
}
