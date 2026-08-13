"use client";

import { getSingleWhiteboard, updateWhiteboard } from "@/src/lib/api/whiteboards/services";
import { whiteboardKeys } from "@/src/lib/api/whiteboards/keys";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { taskService } from "@/src/lib/api/tasks/service";
import type { TaskNodeData, DocumentNodeData } from "@mhamz.01/easyflow-whiteboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import '@mhamz.01/easyflow-whiteboard/dist/styles.css';
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { Lock } from "lucide-react";
import dynamic from "next/dynamic";

// The canvas library is heavy — split it into its own chunk instead of
// bundling it into every navigation to this route, so the whiteboard/docs/
// tasks queries below can fire as soon as this component mounts instead of
// waiting on the canvas bundle to finish downloading and parsing first.
// The `useEffect` below starts that chunk's download immediately (in
// parallel with those queries), so by the time `data` resolves it's
// typically already loaded — same skeleton, same final render, just no
// artificial serialization.
const EasyflowWhiteboard = dynamic(
  () => import("@mhamz.01/easyflow-whiteboard").then((mod) => mod.EasyflowWhiteboard),
  {
    ssr: false,
    loading: () => <div className="max-h-max rounded-xl bg-muted animate-pulse" />,
  },
);

export default function WhiteboardEditor({ id }: { id: string }) {
  const { workspace_name, project_id } = useParams<{ workspace_name: string; project_id: string }>();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const queryClient = useQueryClient(); // ✅
  const whiteboardId = Number(id);

  useEffect(() => {
    import("@mhamz.01/easyflow-whiteboard");
  }, []);

  // ── Fetch whiteboard ──────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: whiteboardKeys.single(whiteboardId),
    queryFn: () => getSingleWhiteboard(whiteboardId),
    staleTime: 0,         // ✅ always refetch
    refetchOnMount: true, // ✅ refetch every time component mounts
  });

  // Resolved by the backend (requireWhiteboardAccess) at fetch time —
  // "edit" unconditionally for private whiteboards, otherwise the
  // requester's effective view/edit level on this public whiteboard.
  const isReadOnly = data?.access === "view";

  // ── Fetch docs ────────────────────────────────────────────────────
  const { data: docsData } = useQuery({
    queryKey: ["docs", workspace?.id, project?.id],
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!workspace?.id && !!project?.id,
    staleTime: 1000 * 60,
  });

  // ── Fetch tasks ───────────────────────────────────────────────────
  const { data: tasksData } = useQuery({
    queryKey: ["tasks", "project", project?.id],
    queryFn: () => taskService.getTasksByProject(project!.id),
    enabled: !!project?.id,
    staleTime: 1000 * 60,
  });

  // ── Mutation ──────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: updateWhiteboard,
    onSuccess: () => {
      // ✅ bust cache so next mount always fetches fresh
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.single(whiteboardId) });
      console.log("✅ Whiteboard saved");
    },
    onError: (err) => {
      console.error("❌ Whiteboard save failed:", err);
    },
  });

  // ── Transform docs → DocumentNodeData ────────────────────────────
  const availableDocuments: DocumentNodeData[] =
    docsData?.docs.map((doc) => ({
      id: String(doc.id),
      type: "document" as const,
      title: doc.documentName,
      project: project?.projectName ?? "",
      breadcrumb: [project?.projectName ?? ""],
      preview: doc.preview,
      updatedAt: doc.createdDate
        ? new Date(doc.createdDate).toLocaleDateString()
        : "",
      x: 0,
      y: 0,
    })) ?? [];

  // ── Transform tasks → TaskNodeData ───────────────────────────────
  const availableTasks: TaskNodeData[] =
    tasksData?.tasks.map((task) => ({
      id: String(task.id),
      type: "task" as const,
      title: task.name,
      status: (task.state === "in progress"
        ? "in-progress"
        : task.state) as TaskNodeData["status"],
      assignee: task.assignees?.[0]?.username ?? "",
      project: project?.projectName ?? "",
      priority: task.priority as TaskNodeData["priority"],
      dueDate: task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "",
      x: 0,
      y: 0,
    })) ?? [];

  if (isLoading) {
    return <div className="max-h-max rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <div className="w-screen h-screen relative">
      {isReadOnly && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Lock size={12} />
          View only
        </div>
      )}
      <EasyflowWhiteboard
        initialData={data?.whiteboard.content ?? {
          canvas: "",
          tasks: [],
          documents: [],
        }}
        onSave={(payload) => {
          // Belt-and-suspenders: the canvas is already non-editable via the
          // `editable` prop, so this shouldn't fire — but don't persist a
          // write the backend would reject anyway if it somehow does.
          if (isReadOnly) return;
          mutation.mutate({
            id: whiteboardId,
            columnName: "content",
            value: payload,
          });
        }}
        saveDebounceMs={2000}
        availableDocuments={availableDocuments}
        availableTasks={availableTasks}
        createNewTaskHref={`/${workspace_name}/${project_id}/tasks`}
        createNewDocumentHref={`/${workspace_name}/${project_id}/docs`}
        editable={!isReadOnly}
      />
    </div>
  );
}
